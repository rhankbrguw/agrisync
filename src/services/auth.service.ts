import { supabase } from '../lib/supabase';
import { createSuccessResponse } from '../utils/response';
import { TABLES } from '../constants/tables';
import { USER_ROLE, type UserRole } from '../constants/enums';
import { APP_STRINGS } from '../constants/strings';
import { AppError } from '../utils/errors';

export interface ResolvedUser {
  id: string;
  email: string;
  employee_id?: string;
  company_id?: string;
  company_name?: string;
  workspace_code?: string;
  subscription_tier?: string;
  subscription_updated_at?: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  full_name?: string;
}

interface EmployeeRow {
  id: string;
  company_id: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  full_name: string;
  companies: { name: string; workspace_code: string; subscription_tier: string; updated_at: string } | null;
}

const EMPLOYEE_SELECT = 'id, company_id, role, avatar_url, phone, bio, full_name, companies(name, workspace_code, subscription_tier, updated_at)';

function mapEmployeeToUser(row: EmployeeRow, authId: string, email: string): ResolvedUser {
  return {
    id: authId,
    email,
    employee_id: row.id,
    company_id: row.company_id,
    company_name: row.companies?.name ?? undefined,
    workspace_code: row.companies?.workspace_code ?? undefined,
    subscription_tier: row.companies?.subscription_tier ?? 'FREE',
    subscription_updated_at: row.companies?.updated_at ?? undefined,
    role: row.role,
    avatar_url: row.avatar_url ?? undefined,
    phone: row.phone ?? undefined,
    bio: row.bio ?? undefined,
    full_name: row.full_name,
  };
}

async function findEmployeeByAuthId(uid: string): Promise<EmployeeRow | null> {
  const { data, error } = await supabase
    .from(TABLES.EMPLOYEES)
    .select(EMPLOYEE_SELECT)
    .eq('auth_id', uid)
    .maybeSingle();

  if (error) throw new AppError('INTERNAL_ERROR', error.message);
  return data as EmployeeRow | null;
}

export const AuthService = {
  async resolveUser(uid: string, email: string) {
    const linked = await findEmployeeByAuthId(uid);
    if (linked) return createSuccessResponse(mapEmployeeToUser(linked, uid, email));

    const { data: claimed, error: claimError } = await supabase.rpc('claim_employee_record');

    if (claimError) {
      throw new AppError('INTERNAL_ERROR', APP_STRINGS.ERRORS.CLAIM_RECORD_FAILED(claimError.message));
    }

    if (claimed) {
      const freshRecord = await findEmployeeByAuthId(uid);
      if (freshRecord) return createSuccessResponse(mapEmployeeToUser(freshRecord, uid, email));
    }

    const { data: pendingReq } = await supabase
      .from(TABLES.ACCESS_REQUESTS)
      .select('id')
      .eq('email', email)
      .eq('status', 'PENDING')
      .maybeSingle();

    if (pendingReq) {
      return createSuccessResponse({ id: uid, email, role: USER_ROLE.PendingAccess });
    }

    return createSuccessResponse({ id: uid, email, role: USER_ROLE.New });
  },

  async loginWithOtp(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/login` },
    });
    if (error) throw new AppError('UNAUTHENTICATED', error.message);
  },

  async requestAccess(payload: {
    email: string;
    phone: string;
    full_name: string;
    companyCode: string;
  }) {
    const { error } = await supabase.rpc('request_workspace_access', {
      p_code: payload.companyCode,
      p_email: payload.email,
      p_full_name: payload.full_name,
      p_phone: payload.phone,
    });
    
    if (error) {
      const code = error.code === '23505' ? 'CONFLICT' : 'INTERNAL_ERROR';
      throw new AppError(code, error.message ?? APP_STRINGS.ACTION_MESSAGES.REQ_FAILED);
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new AppError('INTERNAL_ERROR', error.message);
  },
};
