import Dexie, { type EntityTable } from 'dexie';

export interface ReportQueue {
  id?: number;
  imageBlob: Blob;
  latitude: number;
  longitude: number;
  timestamp: string;
  retryCount: number;
  notes?: string;
  category_id?: string;
  zone_id?: string;
}

const db = new Dexie('AgriSyncDB') as Dexie & {
  reports_queue: EntityTable<ReportQueue, 'id'>;
};

db.version(3).stores({
  reports_queue: '++id, timestamp, retryCount, category_id, zone_id',
});

export { db };
