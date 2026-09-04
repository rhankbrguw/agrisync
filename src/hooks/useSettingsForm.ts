import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore, type AuthState } from '../store/authStore';
import { phoneSchema, bioSchema } from '../schemas/validation';
import { useAvatarUpload } from './useAvatarUpload';

const settingsSchema = z.object({
  phone: phoneSchema.optional().or(z.literal('')),
  bio: bioSchema.optional().or(z.literal('')),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function useSettingsForm(isOpen: boolean, onClose: () => void) {
  const user = useAuthStore((state: AuthState) => state.user);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { previewUrl, setPreviewUrl, handleFileChange, updateProfileMutation, isCompressing } = useAvatarUpload(onClose);

  useEffect(() => {
    if (isOpen && !previewUrl && user?.avatar_url) {
      setPreviewUrl(user.avatar_url);
    }
  }, [isOpen, previewUrl, user?.avatar_url, setPreviewUrl]);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { phone: user?.phone || '', bio: user?.bio || '' },
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0]);
  };

  const onSubmit = form.handleSubmit(async (data: SettingsFormValues) => {
    if (!user?.employee_id) return;
    
    useAuthStore.setState(state => ({
      user: state.user ? { 
        ...state.user, 
        avatar_url: previewUrl || state.user.avatar_url,
        phone: data.phone || state.user.phone,
        bio: data.bio || state.user.bio
      } : null
    }));
    
    await updateProfileMutation.mutateAsync({ ...data, bio: data.bio || undefined });
  });

  return {
    form,
    fileInputRef,
    previewUrl,
    onFileChange,
    onSubmit,
    isPending: updateProfileMutation.isPending,
    isCompressing
  };
}
