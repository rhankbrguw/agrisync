import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { ProfileService } from '../services/profile.service';
import { useAuthStore } from '../store/authStore';
import { APP_STRINGS } from '../constants/strings';
import { APP_CONFIG } from '../constants/config';
import { TOAST_IDS } from '../constants/toastIds';
import { toAppError } from '../utils/errors';

export function useAvatarUpload(onSuccessCallback?: () => void) {
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const user = useAuthStore((state) => state.user);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  const handleFileChange = async (file?: File) => {
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await imageCompression(file, { maxSizeMB: APP_CONFIG.AVATAR.MAX_SIZE_MB, maxWidthOrHeight: APP_CONFIG.AVATAR.MAX_DIMENSION, useWebWorker: true });
      setAvatarBlob(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch {
      toast.error(APP_STRINGS.ACTION_MESSAGES.IMAGE_PROCESS_FAILED, { id: TOAST_IDS.IMAGE_ERROR });
    } finally {
      setIsCompressing(false);
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: (data: { phone?: string; bio?: string }) => 
      ProfileService.updateProfile({
        employeeId: user!.employee_id!,
        phone: data.phone,
        bio: data.bio,
        avatarBlob: avatarBlob,
        currentAvatarUrl: user?.avatar_url
      }),
    onSuccess: async () => {
      toast.success(APP_STRINGS.ACTION_MESSAGES.PROFILE_UPDATE_SUCCESS, { id: TOAST_IDS.SAVE_SUCCESS });
      await refreshUser();
      onSuccessCallback?.();
    },
    onError: (err: unknown) => {
      toast.error(toAppError(err).message, { id: TOAST_IDS.SAVE_ERROR });
    }
  });

  return { avatarBlob, previewUrl, setPreviewUrl, handleFileChange, updateProfileMutation, isCompressing };
}

