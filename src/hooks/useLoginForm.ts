import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AuthService } from '../services/auth.service';
import { emailSchema } from '../schemas/validation';
import type { Mode } from '../pages/Login/components';
import { TOAST_IDS } from '../constants/toastIds';
import { toAppError } from '../utils/errors';

const loginSchema = z.object({ email: emailSchema });
export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const [isLoading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('LOGIN');
  const [lastEmail, setLastEmail] = useState('');

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '' },
  });

  const handleLoginSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      await AuthService.loginWithOtp(data.email);
      setLastEmail(data.email);
      setMode('SENT_MAGIC');
    } catch (err: unknown) {
      const appErr = toAppError(err);
      toast.error(appErr.message, { id: TOAST_IDS.AUTH_ERROR });
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    mode,
    setMode,
    lastEmail,
    loginForm,
    handleLoginSubmit,
  };
}
