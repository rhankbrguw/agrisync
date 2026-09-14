import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { EmployeeService } from '../services/employee.service';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { QUERY_KEYS } from '../constants/queryKeys';
import { CHANNELS, DB_EVENTS } from '../constants/channels';
import { TABLES, SCHEMAS } from '../constants/tables';


function useEmployeeRealtime(companyId?: string) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!companyId) return;
    const channel = supabase.channel(CHANNELS.EMPLOYEE_UPDATES)
      .on(DB_EVENTS.POSTGRES_CHANGES, { event: DB_EVENTS.ALL, schema: SCHEMAS.PUBLIC, table: TABLES.EMPLOYEES }, () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES, companyId] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_LIMITS, companyId] });
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient, companyId]);
}

function useEmployeeMutations(companyId?: string) {
  const queryClient = useQueryClient();

  const updateRole = useMutation({
    mutationFn: (args: { employeeId: string; newRole: Extract<import('../constants/enums').UserRole, 'WORKER' | 'SUPERVISOR'> }) =>
      EmployeeService.updateRole(args.employeeId, args.newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES, companyId] });
    }
  });

  const revokeAccess = useMutation({
    mutationFn: (employeeId: string) => EmployeeService.revokeAccess(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES, companyId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_LIMITS, companyId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
    }
  });

  return { updateRole, revokeAccess };
}

export function useEmployees() {
  const user = useAuthStore((state) => state.user);

  const query = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEES, user?.company_id],
    queryFn: async () => (await EmployeeService.fetchEmployees(user!.company_id!)).data,
    enabled: !!user?.company_id,
  });

  useEmployeeRealtime(user?.company_id);
  const mutations = useEmployeeMutations(user?.company_id);

  return useMemo(() => ({
    ...query,
    ...mutations,
  }), [query, mutations]);
}

