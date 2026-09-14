import { supabase } from '../lib/supabase';
import { TABLES } from '../constants/tables';

import { createSuccessResponse } from '../utils/response';

export const DashboardService = {
  async fetchStats() {
    const [reports, workers] = await Promise.all([
      supabase.from(TABLES.FIELD_REPORTS).select('*', { count: 'exact', head: true }),
      supabase.from(TABLES.EMPLOYEES).select('*', { count: 'exact', head: true })
    ]);
    
    if (reports.error) throw reports.error;
    if (workers.error) throw workers.error;

    return createSuccessResponse({
      totalReports: reports.count || 0,
      activeWorkers: workers.count || 0,
      pendingSync: 0,
    });
  }
};
