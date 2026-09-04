import { supabase } from '../lib/supabase';
import { TABLES } from '../constants/tables';
import { APP_STRINGS } from '../constants/strings';
import { AppError } from '../utils/errors';
import { createSuccessResponse } from '../utils/response';

interface UpdateProfilePayload {
  employeeId: string;
  phone?: string | null;
  bio?: string | null;
  avatarBlob?: Blob | null;
  currentAvatarUrl?: string | null;
}

const uploadAvatar = async (authId: string, avatarBlob: Blob): Promise<string> => {
  const fileName = `${authId}/profile_${Date.now()}.jpg`;
  const { data: storageData, error: storageErr } = await supabase.storage
    .from(TABLES.AVATARS)
    .upload(fileName, avatarBlob, { upsert: true });

  if (storageErr) throw new AppError('INTERNAL_ERROR', storageErr.message);
  const { data: publicUrlData } = supabase.storage.from(TABLES.AVATARS).getPublicUrl(storageData.path);
  return publicUrlData.publicUrl;
};

export const ProfileService = {
  async updateProfile(payload: UpdateProfilePayload) {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      throw new AppError('UNAUTHENTICATED', APP_STRINGS.ERRORS.AUTH_REQUIRED_PROFILE);
    }

    let finalAvatarUrl = payload.currentAvatarUrl;
    if (payload.avatarBlob) {
      finalAvatarUrl = await uploadAvatar(authData.user.id, payload.avatarBlob);
    }

    const { error: dbErr } = await supabase.from(TABLES.EMPLOYEES).update({
      phone: payload.phone || null,
      bio: payload.bio || null,
      avatar_url: finalAvatarUrl,
    }).eq('id', payload.employeeId);

    if (dbErr) throw new AppError('INTERNAL_ERROR', dbErr.message);
    return createSuccessResponse(null);
  },
};
