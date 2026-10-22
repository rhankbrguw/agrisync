import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { EmployeeService } from '../services/employee.service';
import { QUERY_KEYS } from '../constants/queryKeys';
import { APP_CONFIG } from '../constants/config';

export function useCompanyLimits() {
  const user = useAuthStore(state => state.user);
  
  const query = useQuery({
    queryKey: [QUERY_KEYS.COMPANY_LIMITS, user?.company_id],
    queryFn: async () => (await EmployeeService.fetchCompanyLimits(user!.company_id!)).data,
    enabled: !!user?.company_id,
  });

  return {
    ...query,
    workerCount: query.data?.workerCount ?? 0,
    maxWorkers: query.data?.maxWorkers ?? APP_CONFIG.LIMITS.DEFAULT_MAX_WORKERS,
    isLimitReached: (query.data?.workerCount ?? 0) >= (query.data?.maxWorkers ?? APP_CONFIG.LIMITS.DEFAULT_MAX_WORKERS)
  };
}
