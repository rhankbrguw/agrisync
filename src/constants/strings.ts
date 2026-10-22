import { COMMON_STRINGS } from './strings/common.strings';
import { AUTH_STRINGS } from './strings/auth.strings';
import { WORKER_STRINGS } from './strings/worker.strings';
import { DASHBOARD_STRINGS } from './strings/dashboard.strings';
import { BILLING_STRINGS } from './strings/billing.strings';

export const APP_STRINGS = {
  ...COMMON_STRINGS,
  ...AUTH_STRINGS,
  ...WORKER_STRINGS,
  ...DASHBOARD_STRINGS,
  ...BILLING_STRINGS,
} as const;
