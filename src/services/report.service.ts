import { supabase } from '../lib/supabase';
import { APP_CONFIG } from '../constants/config';
import { TABLES } from '../constants/tables';
import { AppError } from '../utils/errors';
import { createSuccessResponse } from '../utils/response';

export interface FieldReport {
  id: string;
  latitude: number;
  longitude: number;
  image_url: string;
  notes?: string;
  status: string;
  created_at?: string;
  employees: { email: string; full_name?: string } | { email: string; full_name?: string }[];
  report_categories?: { name: string; severity_level: string } | { name: string; severity_level: string }[];
  zones?: { name: string } | { name: string }[];
  report_comments?: { content: string; created_at: string; employees: { full_name: string } | { full_name: string }[] }[];
}

export const ReportService = {
  async fetchReports(companyId: string) {
    const { data, error } = await supabase
      .from(TABLES.FIELD_REPORTS)
      .select(`id, latitude, longitude, image_url, notes, status, created_at, employees ( email, full_name ), report_categories ( name, severity_level ), zones ( name ), report_comments ( content, created_at, employees ( full_name ) )`)
      .eq('company_id', companyId)
      .not('latitude', 'is', null)
      .order('created_at', { ascending: false })
      .limit(APP_CONFIG.UI.REPORTS_QUERY_LIMIT);

    if (error) throw new AppError('INTERNAL_ERROR', error.message);
    return createSuccessResponse(data as FieldReport[]);
  },

  async updateReportStatusAndComment(payload: { reportId: string; status?: string; comment?: string; employeeId?: string }) {
    let updated = false;

    if (payload.status) {
      const { error } = await supabase.from(TABLES.FIELD_REPORTS).update({ status: payload.status }).eq('id', payload.reportId);
      if (error) throw new AppError('INTERNAL_ERROR', error.message);
      updated = true;
    }

    if (payload.comment && payload.employeeId) {
      const { error } = await supabase.from(TABLES.REPORT_COMMENTS).insert([{
        report_id: payload.reportId,
        employee_id: payload.employeeId,
        content: payload.comment.trim(),
      }]);
      if (error) throw new AppError('INTERNAL_ERROR', error.message);
      updated = true;
    }

    return createSuccessResponse(updated);
  },
};
