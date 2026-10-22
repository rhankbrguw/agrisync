import { z } from 'zod';
import { db, type ReportQueue } from '../lib/db';
import { supabase } from '../lib/supabase';
import { APP_STRINGS } from '../constants/strings';
import { APP_CONFIG } from '../constants/config';
import { useAuthStore, type User } from '../store/authStore';
import { TABLES } from '../constants/tables';
import { AppError } from '../utils/errors';

const reportSchema = z.object({
  latitude: z.number().min(-90).max(90, APP_STRINGS.ERRORS.SYNC_VALIDATION_GPS),
  longitude: z.number().min(-180).max(180, APP_STRINGS.ERRORS.SYNC_VALIDATION_GPS),
  imageBlob: z.instanceof(Blob).refine((blob) => blob.size > 0, APP_STRINGS.ERRORS.SYNC_VALIDATION_IMAGE),
});

const uploadReportImage = async (imageBlob: Blob, authId: string): Promise<string> => {
  const randomStr = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 15);
  const fileName = `${authId}/${Date.now()}_${randomStr}.jpg`;
  const { data: storageData, error: storageError } = await supabase.storage
    .from(TABLES.REPORTS_MEDIA)
    .upload(fileName, imageBlob, {
      cacheControl: APP_CONFIG.SYNC.STORAGE_CACHE_CONTROL,
      upsert: false,
    });

  if (storageError) throw new AppError('INTERNAL_ERROR', storageError.message);
  return storageData.path;
};

const insertFieldReport = async (report: ReportQueue, user: User, imagePath: string) => {
  const basePayload = {
    company_id: user.company_id,
    employee_id: user.employee_id,
    image_url: imagePath,
    latitude: report.latitude,
    longitude: report.longitude,
    notes: report.notes,
    created_at: report.timestamp,
  };

  const { error: dbError } = await supabase.from(TABLES.FIELD_REPORTS).insert([{
    ...basePayload,
    category_id: report.category_id,
    zone_id: report.zone_id,
  }]);

  if (!dbError) return;

  if (dbError.code === '23503' || dbError.message.includes('foreign key constraint')) {
    const { error: retryError } = await supabase.from(TABLES.FIELD_REPORTS).insert([basePayload]);
    if (!retryError) return;
    await supabase.storage.from(TABLES.REPORTS_MEDIA).remove([imagePath]);
    throw new AppError('INTERNAL_ERROR', retryError.message);
  }

  await supabase.storage.from(TABLES.REPORTS_MEDIA).remove([imagePath]);
  throw new AppError('INTERNAL_ERROR', dbError.message);
};

const syncSingleReport = async (report: ReportQueue, user: User) => {
  const parseResult = reportSchema.safeParse(report);
  if (!parseResult.success) {
    throw new AppError('VALIDATION_ERROR', parseResult.error.issues[0].message);
  }

  const imagePath = await uploadReportImage(report.imageBlob, user.id);
  await insertFieldReport(report, user, imagePath);
  await db.reports_queue.delete(report.id!);
};

const handleSyncError = async (report: ReportQueue) => {
  const nextRetryCount = (report.retryCount || 0) + 1;
  // Retain report in offline queue so data is never lost silently
  await db.reports_queue.update(report.id!, { retryCount: nextRetryCount });
};

let activeSyncPromise: Promise<number> | null = null;

export const syncOfflineData = async (): Promise<number> => {
  if (activeSyncPromise) return activeSyncPromise;

  activeSyncPromise = (async () => {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.company_id || !user?.employee_id) return 0;

      const pendingReports = await db.reports_queue.toArray();
      if (pendingReports.length === 0) return 0;

      let successCount = 0;
      for (const report of pendingReports) {
        try {
          await syncSingleReport(report, user);
          successCount++;
        } catch {
          await handleSyncError(report);
        }
      }
      return successCount;
    } finally {
      activeSyncPromise = null;
    }
  })();

  return activeSyncPromise;
};
