export const USER_ROLE = {
  Worker: 'WORKER',
  Supervisor: 'SUPERVISOR',
  New: 'NEW',
  PendingAccess: 'PENDING_ACCESS',
} as const;
export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

export const REPORT_STATUS = {
  Pending: 'PENDING',
  Investigating: 'INVESTIGATING',
  Resolved: 'RESOLVED',
} as const;

export const REQUEST_STATUS = {
  Pending: 'PENDING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
} as const;

export const THEME = {
  Light: 'light',
  Dark: 'dark',
} as const;

export const BILLING_TIER = {
  Free: 'FREE',
  Pro: 'PRO',
  Enterprise: 'ENTERPRISE',
} as const;
export type BillingTier = typeof BILLING_TIER[keyof typeof BILLING_TIER];
