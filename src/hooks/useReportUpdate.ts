import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { APP_STRINGS } from '../constants/strings';
import { ReportService } from '../services/report.service';
import { QUERY_KEYS } from '../constants/queryKeys';
import { useAuthStore } from '../store/authStore';
import { toAppError } from '../utils/errors';

interface UpdateReportParams {
  reportId: string;
  status?: string;
  comment?: string;
}

export function useReportUpdate() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async ({ reportId, status, comment }: UpdateReportParams) => {
      const response = await ReportService.updateReportStatusAndComment({ 
        reportId, 
        status, 
        comment,
        employeeId: user?.employee_id 
      });
      return response.data;
    },
    onSuccess: (updated: boolean) => {
      if (updated) {
        toast.success(APP_STRINGS.UI.REPORT_SENT);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
      }
    },
    onError: (err: unknown) => {
      toast.error(toAppError(err).message);
    }
  });
}
