import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { useCompanyData } from './useCompanyData';
import { useNetworkStatus } from './useNetworkStatus';
import { useReportSubmission } from './useReportSubmission';
import { startGPSPreWarming, stopGPSPreWarming } from '../utils/geolocation';
import { syncOfflineData } from '../services/sync.service';
import { APP_STRINGS } from '../constants/strings';
import { TOAST_IDS } from '../constants/toastIds';

const reportSchema = z.object({
  notes: z.string().optional(),
  categoryId: z.string().min(1, APP_STRINGS.WORKER.CATEGORY_PLACEHOLDER),
  zoneId: z.string().min(1, APP_STRINGS.WORKER.ZONE_PLACEHOLDER),
});
export type ReportFormValues = z.infer<typeof reportSchema>;

export function useWorkerReport() {
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const user = useAuthStore(state => state.user);
  const { data: companyData } = useCompanyData();

  const triggerSyncUI = useCallback((onlineState: boolean) => {
    if (onlineState) {
      toast.promise(syncOfflineData(), {
        id: TOAST_IDS.NETWORK_STATUS,
        loading: APP_STRINGS.UI.SYNC_PENDING,
        success: (count: number) => count > 0 ? APP_STRINGS.UI.SYNC_SUCCESS : APP_STRINGS.UI.ALREADY_SYNCED,
        error: APP_STRINGS.ERRORS.SYNC_FAILED,
      });
    } else {
      toast.error(APP_STRINGS.UI.OFFLINE_MODE, { id: TOAST_IDS.NETWORK_STATUS });
    }
  }, []);

  const handleOnline = useCallback(() => triggerSyncUI(true), [triggerSyncUI]);
  const handleOffline = useCallback(() => triggerSyncUI(false), [triggerSyncUI]);

  const { isOnline } = useNetworkStatus(handleOnline, handleOffline);
  
  const { submitReport, isSubmitting, showSuccess } = useReportSubmission(isOnline);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { notes: '', categoryId: '', zoneId: '' },
  });

  const handleLogout = async () => {
    useAuthStore.getState().logout();
  };

  useEffect(() => {
    startGPSPreWarming();
    (async () => {
      try {
        await syncOfflineData();
      } catch {
        // Handled silently in background; UI receives notification if triggered via triggerSyncUI
      }
    })();
    return () => stopGPSPreWarming();
  }, []);

  const onSubmit = async (data: ReportFormValues) => {
    await submitReport(
      { photoBlob: photoBlob!, notes: data.notes || '', categoryId: data.categoryId, zoneId: data.zoneId },
      () => { setPhotoBlob(null); form.reset(); }
    );
  };

  return {
    user,
    companyData,
    isOnline,
    form,
    photoBlob,
    setPhotoBlob,
    showSettings,
    setShowSettings,
    isSubmitting,
    showSuccess,
    onSubmit,
    handleLogout
  };
}
