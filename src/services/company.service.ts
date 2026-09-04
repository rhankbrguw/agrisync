import { supabase } from '../lib/supabase';
import { TABLES } from '../constants/tables';
import { AppError } from '../utils/errors';
import { createSuccessResponse } from '../utils/response';

export const CompanyService = {
  async fetchCategoriesAndZones(companyId: string) {
    const [catRes, zoneRes] = await Promise.all([
      supabase.from(TABLES.REPORT_CATEGORIES).select('id, name').eq('company_id', companyId),
      supabase.from(TABLES.ZONES).select('id, name').eq('company_id', companyId),
    ]);

    if (catRes.error) throw new AppError('INTERNAL_ERROR', catRes.error.message);
    if (zoneRes.error) throw new AppError('INTERNAL_ERROR', zoneRes.error.message);

    return createSuccessResponse({
      categories: catRes.data || [],
      zones: zoneRes.data || [],
    });
  },
};
