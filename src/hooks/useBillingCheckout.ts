import { APP_CONFIG } from '../constants/config';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { APP_STRINGS } from '../constants/strings';
import { ROUTES } from '../constants/routes';
import { BILLING_TIER } from '../constants/enums';
import { BillingService } from '../services/billing.service';
import { TOAST_IDS } from '../constants/toastIds';
import { toAppError } from '../utils/errors';
import { QueryClient } from '@tanstack/react-query';
import type { NavigateFunction } from 'react-router-dom';

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: Record<string, unknown>) => void;
    };
  }
}

export function useBillingCheckout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const response = await BillingService.createCheckoutSession(BILLING_TIER.Pro);
      const token = response.data;
      return token;
    },
    onSuccess: (token: string) => {
      const snapScriptId = 'midtrans-snap-script';
      
      if (!document.getElementById(snapScriptId)) {
        const script = document.createElement('script');
        script.id = snapScriptId;
        script.src = APP_CONFIG.PAYMENT.MIDTRANS_SCRIPT_URL; 
        script.setAttribute('data-client-key', APP_CONFIG.PAYMENT.MIDTRANS_CLIENT_KEY); 
        
        script.onload = () => {
          triggerSnapPopup(token, queryClient, navigate);
        };
        document.body.appendChild(script);
      } else {
        triggerSnapPopup(token, queryClient, navigate);
      }
    },
    onError: (error: unknown) => {
      toast.error(toAppError(error).message, { id: TOAST_IDS.CHECKOUT_ERROR });
    }
  });
}

function triggerSnapPopup(token: string, queryClient: QueryClient, navigate: NavigateFunction) {
  window.snap.pay(token, {
    onSuccess: async function(){
      toast.success(APP_STRINGS.BILLING.PAYMENT_SUCCESS);
      
      queryClient.invalidateQueries();
      
      const { useAuthStore } = await import('../store/authStore');
      useAuthStore.getState().refreshUser();
      
      setTimeout(() => navigate(ROUTES.DASHBOARD), APP_CONFIG.UI.REDIRECT_MS);
    },
    onPending: function(){
      toast.info(APP_STRINGS.BILLING.PAYMENT_PENDING);
    },
    onError: function(){
      toast.error(APP_STRINGS.BILLING.PAYMENT_ERROR);
    },
    onClose: function(){
      toast.error(APP_STRINGS.BILLING.PAYMENT_CANCELLED);
    }
  });
}
