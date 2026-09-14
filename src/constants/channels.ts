export const CHANNELS = {
  ACCESS_REQUESTS: 'access-reqs',
  REALTIME_REPORTS: 'realtime_reports',
  DASHBOARD_METRICS: 'dashboard-metrics',
  EMPLOYEE_UPDATES: 'employee-updates',
  GLOBAL_USER_SYNC: 'global-user-sync',
} as const;

export const DB_EVENTS = {
  POSTGRES_CHANGES: 'postgres_changes',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  ALL: '*',
} as const;
