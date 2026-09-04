import { db } from '../lib/db';

export const LocalDBService = {
  async addReportToQueue(payload: {
    imageBlob: Blob;
    latitude: number;
    longitude: number;
    notes: string;
    category_id?: string;
    zone_id?: string;
  }) {
    return await db.reports_queue.add({
      ...payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    });
  }
};
