import { supabase } from '../lib/supabase';
import { APP_STRINGS } from '../constants/strings';
import { TABLES } from '../constants/tables';
import type { UserRole } from '../constants/enums';
import { AppError } from '../utils/errors';
import { createSuccessResponse } from '../utils/response';

export interface Employee {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export const EmployeeService = {
  async fetchCompanyLimits(companyId: string) {
    const [compRes, empRes] = await Promise.all([
      supabase.from(TABLES.COMPANIES).select('max_workers').eq('id', companyId).single(),
      supabase.from(TABLES.EMPLOYEES).select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    ]);

    if (compRes.error) throw new AppError('INTERNAL_ERROR', compRes.error.message);
    if (empRes.error) throw new AppError('INTERNAL_ERROR', empRes.error.message);

    return createSuccessResponse({
      maxWorkers: compRes.data?.max_workers || 0,
      workerCount: empRes.count || 0,
    });
  },

  async inviteEmployee(payload: { email: string; full_name: string; role: UserRole; company_id: string }) {
    const { error } = await supabase.from(TABLES.EMPLOYEES).insert([payload]);
    if (error) {
      const code = error.code === '23505' ? 'CONFLICT' : 'INTERNAL_ERROR';
      const msg = error.code === '23505' ? APP_STRINGS.ACTION_MESSAGES.INVITE_FAILED_DUPLICATE : error.message;
      throw new AppError(code, msg);
    }
    return createSuccessResponse(null);
  },

  async fetchEmployees(companyId: string) {
    const { data, error } = await supabase.from(TABLES.EMPLOYEES).select('*').eq('company_id', companyId).order('created_at', { ascending: false });
    if (error) throw new AppError('INTERNAL_ERROR', error.message);
    return createSuccessResponse(data as Employee[]);
  },

  async updateRole(employeeId: string, newRole: UserRole) {
    const { error } = await supabase.from(TABLES.EMPLOYEES).update({ role: newRole }).eq('id', employeeId);
    if (error) throw new AppError('INTERNAL_ERROR', error.message);
    return createSuccessResponse(null);
  },

  async revokeAccess(employeeId: string) {
    const { error } = await supabase.from(TABLES.EMPLOYEES).delete().eq('id', employeeId);
    if (error) throw new AppError('INTERNAL_ERROR', error.message);
    return createSuccessResponse(null);
  },
};
