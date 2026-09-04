import { supabase } from '../lib/supabase';
import { APP_STRINGS } from '../constants/strings';
import { AppError } from '../utils/errors';

interface RegisterPayload {
  companyName: string;
  fullName: string;
  phone: string;
  authId: string;
  email: string;
}

const ONBOARDING_TIMEOUT_MS = 10000;

export const OnboardingService = {
  async registerCompanyAndProfile(payload: RegisterPayload) {
    try {
      const rpcCall = supabase.rpc('register_company_and_profile', {
        p_company_name: payload.companyName,
        p_full_name: payload.fullName,
        p_phone: payload.phone,
        p_email: payload.email,
      });

      const timeoutCall = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT')), ONBOARDING_TIMEOUT_MS);
      });

      const { error } = await Promise.race([rpcCall, timeoutCall]) as { error: { message: string } | null; data: unknown };

      if (error) {
        throw new AppError('INTERNAL_ERROR', error.message ?? APP_STRINGS.ONBOARDING.ERROR_CREATE_COMPANY);
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      if (err instanceof Error && err.message === 'TIMEOUT') {
        throw new AppError('INTERNAL_ERROR', APP_STRINGS.ERRORS.CONNECTION_TIMEOUT);
      }
      throw new AppError('INTERNAL_ERROR', APP_STRINGS.ONBOARDING.ERROR_CREATE_COMPANY);
    }
  },


  async requestWorkspaceAccess(payload: { code: string; email: string; fullName: string; phone: string }) {
    const { error } = await supabase.rpc('request_workspace_access', {
      p_code: payload.code,
      p_email: payload.email,
      p_full_name: payload.fullName,
      p_phone: payload.phone,
    });
    
    if (error) {
      throw new AppError('INTERNAL_ERROR', error.message);
    }
  },
};
