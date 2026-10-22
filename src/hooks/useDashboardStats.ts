import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DashboardService } from '../services/dashboard.service';
import { QUERY_KEYS } from '../constants/queryKeys';
import { CHANNELS, DB_EVENTS } from '../constants/channels';
import { TABLES, SCHEMAS } from '../constants/tables';

export function useDashboardStats() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS],
    queryFn: async () => (await DashboardService.fetchStats()).data,
  });

  useEffect(() => {
    const channel = supabase.channel(CHANNELS.DASHBOARD_METRICS)
      .on(DB_EVENTS.POSTGRES_CHANGES, { event: DB_EVENTS.ALL, schema: SCHEMAS.PUBLIC, table: TABLES.FIELD_REPORTS }, () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      })
      .on(DB_EVENTS.POSTGRES_CHANGES, { event: DB_EVENTS.ALL, schema: SCHEMAS.PUBLIC, table: TABLES.EMPLOYEES }, () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

