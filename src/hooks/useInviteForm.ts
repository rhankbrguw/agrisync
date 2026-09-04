import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCompanyLimits } from './useCompanyLimits';
import { useAuthStore, type AuthState } from '../store/authStore';
import { useInviteEmployee } from './useInviteEmployee';
import { APP_STRINGS } from '../constants/strings';
import { APP_CONFIG } from '../constants/config';
import { TOAST_IDS } from '../constants/toastIds';
import { emailSchema, nameSchema } from '../schemas/validation';
import { USER_ROLE, type UserRole } from '../constants/enums';

const inviteSchema = z.object({
  email: emailSchema,
  fullName: nameSchema,
  role: z.enum([USER_ROLE.Worker, USER_ROLE.Supervisor]),
});

export type InviteFormValues = z.infer<typeof inviteSchema>;

export function useInviteForm() {
  const user = useAuthStore((state: AuthState) => state.user);
  const [sharedWorker, setSharedWorker] = useState<{name: string, email: string, role: string} | null>(null);
  
  const { isLoading: loadingLimits, workerCount, maxWorkers, isLimitReached } = useCompanyLimits();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '', fullName: '', role: USER_ROLE.Worker },
  });

  const inviteMutation = useInviteEmployee();

  const onSubmit = async (data: InviteFormValues) => {
    if (isLimitReached) {
      toast.error(APP_STRINGS.DASHBOARD.INVITE_UPGRADE_REQUIRED(maxWorkers), { id: TOAST_IDS.INVITE_ERROR, duration: APP_CONFIG.UI.LONG_TOAST_DURATION_MS });
      return;
    }
    try {
      await inviteMutation.mutateAsync({
        ...data,
        companyId: user!.company_id!,
        role: data.role as UserRole,
      });
      setSharedWorker({ name: data.fullName, email: data.email, role: data.role });
      form.reset();
    } catch {
      // Error notifications handled by useInviteEmployee onError
    }
  };

  const handleValidationError = () => {
    toast.error(APP_STRINGS.DASHBOARD.FORM_VALIDATION_ERROR, { id: TOAST_IDS.FORM_ERROR });
  };

  return {
    user,
    form,
    loadingLimits,
    workerCount,
    maxWorkers,
    sharedWorker,
    setSharedWorker,
    inviteMutation,
    onSubmit,
    handleValidationError
  };
}
