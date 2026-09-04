import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { APP_STRINGS } from '../constants/strings';
import { TOAST_IDS } from '../constants/toastIds';
import { AccessRequestService, type AccessRequest } from '../services/access-request.service';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { QUERY_KEYS } from '../constants/queryKeys';
import { CHANNELS, DB_EVENTS } from '../constants/channels';
import { TABLES, SCHEMAS } from '../constants/tables';
import { USER_ROLE } from '../constants/enums';

function useAccessRequestRealtime(companyId?: string, role?: string) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!companyId || role !== USER_ROLE.Supervisor) return;
    const channel = supabase.channel(CHANNELS.ACCESS_REQUESTS)
      .on(DB_EVENTS.POSTGRES_CHANGES, { event: DB_EVENTS.ALL, schema: SCHEMAS.PUBLIC, table: TABLES.ACCESS_REQUESTS }, () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCESS_REQUESTS] });
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient, companyId, role]);
}

function useAccessRequestMutations(companyId?: string) {
  const queryClient = useQueryClient();

  const approveRequest = useMutation({
    mutationFn: async (req: AccessRequest) => (await AccessRequestService.approveRequest(req, companyId!)).data,
    onSuccess: () => {
      toast.success(APP_STRINGS.ACTION_MESSAGES.REQ_ACCEPT_SUCCESS, { id: TOAST_IDS.ACCESS_SUCCESS });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCESS_REQUESTS, companyId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES, companyId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS, companyId] });
    },
    onError: () => toast.error(APP_STRINGS.ERRORS.GENERIC, { id: TOAST_IDS.REQUEST_ERROR })
  });

  const rejectRequest = useMutation({
    mutationFn: async (requestId: string) => (await AccessRequestService.rejectRequest(requestId)).data,
    onSuccess: () => {
      toast.success(APP_STRINGS.ACTION_MESSAGES.REQ_REJECT_SUCCESS, { id: TOAST_IDS.ACCESS_REJECTED });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCESS_REQUESTS, companyId] });
    },
    onError: () => toast.error(APP_STRINGS.ERRORS.GENERIC, { id: TOAST_IDS.ACCESS_REJECTED_ERROR })
  });

  return { approveRequest, rejectRequest };
}

export function useAccessRequests() {
  const user = useAuthStore((state) => state.user);

  const query = useQuery({
    queryKey: [QUERY_KEYS.ACCESS_REQUESTS, user?.company_id],
    queryFn: async () => (await AccessRequestService.fetchPendingRequests(user!.company_id!)).data,
    enabled: !!user?.company_id && user?.role === USER_ROLE.Supervisor,
  });

  useAccessRequestRealtime(user?.company_id, user?.role);
  const mutations = useAccessRequestMutations(user?.company_id);

  return useMemo(() => ({
    ...query,
    ...mutations,
  }), [query, mutations]);
}

