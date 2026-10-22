import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { APP_STRINGS } from '../constants/strings';
import { EmployeeService } from '../services/employee.service';
import type { UserRole } from '../constants/enums';
import { QUERY_KEYS } from '../constants/queryKeys';
import { TOAST_IDS } from '../constants/toastIds';
import { toAppError } from '../utils/errors';

interface InviteEmployeeParams {
  email: string;
  fullName: string;
  role: UserRole;
  companyId: string;
}

export function useInviteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteEmployeeParams) =>
      EmployeeService.inviteEmployee({
        email: data.email,
        full_name: data.fullName,
        role: data.role,
        company_id: data.companyId,
      }),
    onSuccess: (_, variables: InviteEmployeeParams) => {
      toast.success(`${APP_STRINGS.DASHBOARD.INVITE_SUCCESS} (${variables.email})`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANY_LIMITS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EMPLOYEES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
    },
    onError: (err: unknown) => {
      toast.error(toAppError(err).message, { id: TOAST_IDS.INVITE_ERROR });
    },
  });
}
