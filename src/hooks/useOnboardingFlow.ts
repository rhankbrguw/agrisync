import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { APP_STRINGS } from '../constants/strings';
import { phoneSchema, workspaceCodeSchema, companyNameSchema, nameSchema } from '../schemas/validation';
import { OnboardingService } from '../services/onboarding.service';
import { toAppError } from '../utils/errors';

const onboardingSchema = z.object({
  companyName: companyNameSchema,
  fullName: nameSchema,
  phone: phoneSchema,
  confirm: z.boolean().refine(val => val === true, { message: APP_STRINGS.VALIDATION.CONFIRM_REQUIRED }),
});

const workerSchema = z.object({
  workspaceCode: workspaceCodeSchema,
  fullName: nameSchema,
  phone: phoneSchema,
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
export type WorkerFormValues = z.infer<typeof workerSchema>;
export type OnboardingView = 'CHOICE' | 'WORKER_FORM' | 'WORKER_WAIT' | 'ADMIN';

export function useOnboardingFlow() {
  const { user, refreshUser } = useAuthStore();
  const [view, setView] = useState<OnboardingView>(user?.role === 'PENDING_ACCESS' ? 'WORKER_WAIT' : 'CHOICE');
  const [loading, setLoading] = useState(false);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { companyName: '', fullName: '', phone: '', confirm: undefined },
  });

  const workerForm = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: { workspaceCode: '', fullName: '', phone: '' },
  });

  const handleRegister = async (data: OnboardingFormValues) => {
    if (!user) return;
    setLoading(true);
    try {
      await OnboardingService.registerCompanyAndProfile({
        companyName: data.companyName,
        fullName: data.fullName,
        phone: data.phone,
        authId: user.id,
        email: user.email,
      });
      toast.success(APP_STRINGS.ONBOARDING.SUCCESS);
      await refreshUser();
    } catch (err: unknown) {
      toast.error(toAppError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (data: WorkerFormValues) => {
    if (!user) return;
    setLoading(true);
    try {
      await OnboardingService.requestWorkspaceAccess({
        code: data.workspaceCode,
        email: user.email,
        fullName: data.fullName,
        phone: data.phone,
      });
      toast.success(APP_STRINGS.ONBOARDING.REQUEST_SUCCESS);
      setView('WORKER_WAIT');
    } catch (err: unknown) {
      toast.error(toAppError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    useAuthStore.getState().logout();
  };

  return {
    view,
    setView,
    loading,
    form,
    workerForm,
    user,
    refreshUser,
    handleRegister,
    handleRequestAccess,
    handleLogout,
  };
}
