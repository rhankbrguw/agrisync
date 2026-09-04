import { useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ReportService } from '../services/report.service';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { APP_STRINGS } from '../constants/strings';
import { QUERY_KEYS } from '../constants/queryKeys';
import { CHANNELS, DB_EVENTS } from '../constants/channels';
import { TABLES, SCHEMAS } from '../constants/tables';

function useReportRealtime(companyId?: string) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!companyId) return;
    const channel = supabase.channel(CHANNELS.REALTIME_REPORTS)
      .on(DB_EVENTS.POSTGRES_CHANGES, { event: DB_EVENTS.ALL, schema: SCHEMAS.PUBLIC, table: TABLES.FIELD_REPORTS, filter: `company_id=eq.${companyId}` }, (payload) => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
        if (payload.eventType === 'INSERT') toast.info(APP_STRINGS.MAP.NEW_REPORT_RECEIVED, { icon: '🔔' });
      })
      .on(DB_EVENTS.POSTGRES_CHANGES, { event: DB_EVENTS.ALL, schema: SCHEMAS.PUBLIC, table: TABLES.REPORT_COMMENTS }, () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [companyId, queryClient]);
}

export function useReports() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const query = useQuery({
    queryKey: [QUERY_KEYS.REPORTS],
    queryFn: async () => (await ReportService.fetchReports(user!.company_id!)).data,
    enabled: !!user,
  });

  const updateReport = useMutation({
    mutationFn: async (payload: { reportId: string; status?: string; comment?: string }) => 
      (await ReportService.updateReportStatusAndComment({ ...payload, employeeId: user?.employee_id })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
    }
  });

  useReportRealtime(user?.company_id);

  return useMemo(() => ({
    ...query,
    updateReport,
  }), [query, updateReport]);
}

