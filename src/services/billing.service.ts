import { supabase } from '../lib/supabase';
import { APP_STRINGS } from '../constants/strings';
import { BILLING_TIER, type BillingTier } from '../constants/enums';
import { APP_CONFIG } from '../constants/config';
import { AppError } from '../utils/errors';
import { createSuccessResponse } from '../utils/response';

export const BillingService = {
  async createCheckoutSession(tier: BillingTier = BILLING_TIER.Pro) {
    const { data, error } = await supabase.functions.invoke(APP_CONFIG.FUNCTIONS.CREATE_CHECKOUT, {
      body: { tier },
    });

    if (error) throw new AppError('INTERNAL_ERROR', error.message);
    if (!data?.snapToken) throw new AppError('INTERNAL_ERROR', APP_STRINGS.ERRORS.CHECKOUT_FAILED);

    return createSuccessResponse(data.snapToken as string);
  },
};
