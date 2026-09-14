import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

export function useLocalQueue() {
  const pendingReports = useLiveQuery(() => db.reports_queue.toArray()) || [];
  return { pendingReports };
}
