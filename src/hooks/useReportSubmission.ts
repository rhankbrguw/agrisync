import { useState } from 'react';
import { toast } from 'sonner';
import { LocalDBService } from '../services/local-db.service';
import { syncOfflineData } from '../services/sync.service';
import { getCurrentLocation } from '../utils/geolocation';
import { APP_STRINGS } from '../constants/strings';
import { APP_CONFIG } from '../constants/config';
import { TOAST_IDS } from '../constants/toastIds';
import { toAppError } from '../utils/errors';

async function processReportData(payload: { photoBlob: Blob; notes: string; categoryId: string; zoneId: string }) {
  const location = await getCurrentLocation();
  await LocalDBService.addReportToQueue({ 
    imageBlob: payload.photoBlob, 
    latitude: location.latitude, 
    longitude: location.longitude, 
    notes: payload.notes, 
    category_id: payload.categoryId || undefined, 
    zone_id: payload.zoneId || undefined 
  });
}

function notifySyncStatus(isOnline: boolean) {
  if (isOnline) {
    toast.success(APP_STRINGS.UI.REPORT_SAVED_SYNCING, { id: TOAST_IDS.ACTION });
    // Run sync quietly in background
    (async () => {
      try {
        const count = await syncOfflineData();
        if (count > 0) toast.success(APP_STRINGS.UI.REPORT_SENT, { id: TOAST_IDS.SYNC_SUCCESS });
      } catch {
        toast.error(APP_STRINGS.ERRORS.SYNC_FAILED, { id: TOAST_IDS.SYNC_ERROR });
      }
    })();
  } else {
    toast.success(APP_STRINGS.UI.REPORT_SAVED_LOCAL, { id: TOAST_IDS.ACTION });
  }
}

export function useReportSubmission(isOnline: boolean) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const submitReport = async (payload: { photoBlob: Blob; notes: string; categoryId: string; zoneId: string }, onComplete?: () => void) => {
    if (!payload.photoBlob) return;
    
    setIsSubmitting(true);
    try {
      await processReportData(payload);
      setShowSuccess(true);
      onComplete?.();
      
      notifySyncStatus(isOnline);
      setTimeout(() => setShowSuccess(false), APP_CONFIG.UI.SUCCESS_FEEDBACK_MS);
    } catch (err) {
      toast.error(toAppError(err).message, { id: TOAST_IDS.ACTION });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitReport, isSubmitting, showSuccess };
}

