import { APP_STRINGS } from '../constants/strings';

export function calculateDaysLeft(updatedAt: string | null | undefined): string {
  if (!updatedAt) return '';
  const startDate = new Date(updatedAt);
  const expiryDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const diff = Math.max(0, Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  return APP_STRINGS.BILLING.DAYS_LEFT(diff);
}
