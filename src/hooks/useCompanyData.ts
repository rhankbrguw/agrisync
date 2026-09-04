import { useQuery } from '@tanstack/react-query';
import { CompanyService } from '../services/company.service';
import { useAuthStore } from '../store/authStore';
import { QUERY_KEYS } from '../constants/queryKeys';

export function useCompanyData() {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: [QUERY_KEYS.COMPANY_DATA, user?.company_id],
    queryFn: async () => (await CompanyService.fetchCategoriesAndZones(user!.company_id!)).data,
    enabled: !!user?.company_id,
  });
}

