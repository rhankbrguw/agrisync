import { supabase } from '../lib/supabase';
import { AuthService } from './auth.service';
import { TABLES } from '../constants/tables';
import { REQUEST_STATUS, USER_ROLE } from '../constants/enums';
import { AppError } from '../utils/errors';
import { createSuccessResponse } from '../utils/response';

export interface AccessRequest {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  status: string;
  created_at: string;
}

export const AccessRequestService = {
  async fetchPendingRequests(companyId: string) {
    const { data, error } = await supabase
      .from(TABLES.ACCESS_REQUESTS)
      .select('*')
      .eq('status', REQUEST_STATUS.Pending)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('INTERNAL_ERROR', error.message);
    return createSuccessResponse(data as AccessRequest[]);
  },

  async approveRequest(req: AccessRequest, companyId: string) {
    const { error: empError } = await supabase.from(TABLES.EMPLOYEES).insert([{
      email: req.email,
      full_name: req.full_name,
      role: USER_ROLE.Worker,
      phone: req.phone,
      company_id: companyId,
    }]);

    if (empError) throw new AppError('INTERNAL_ERROR', empError.message);

    const { error: reqError } = await supabase.from(TABLES.ACCESS_REQUESTS).update({
      status: REQUEST_STATUS.Approved,
    }).eq('id', req.id);

    if (reqError) throw new AppError('INTERNAL_ERROR', reqError.message);

    try {
      await AuthService.loginWithOtp(req.email);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new AppError('INTERNAL_ERROR', `Approval succeeded but OTP email failed: ${msg}`);
    }

    return createSuccessResponse(null);
  },

  async rejectRequest(requestId: string) {
    const { error } = await supabase.from(TABLES.ACCESS_REQUESTS).update({
      status: REQUEST_STATUS.Rejected,
    }).eq('id', requestId);

    if (error) throw new AppError('INTERNAL_ERROR', error.message);
    return createSuccessResponse(null);
  },
};
