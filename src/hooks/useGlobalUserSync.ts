import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { CHANNELS, DB_EVENTS } from '../constants/channels';
import { TABLES, SCHEMAS } from '../constants/tables';

export function useGlobalUserSync() {
  useEffect(() => {
    const channel = supabase.channel(CHANNELS.GLOBAL_USER_SYNC)
      .on(DB_EVENTS.POSTGRES_CHANGES, { event: DB_EVENTS.ALL, schema: SCHEMAS.PUBLIC, table: TABLES.EMPLOYEES }, (payload) => {
        const currentUser = useAuthStore.getState().user;
        const newRecord = payload.new as Record<string, unknown> | undefined;
        if (currentUser && newRecord && newRecord.email === currentUser.email) {
          const { avatar_url, phone, bio, full_name, role, company_id } = newRecord;
          useAuthStore.setState((state) => ({
            user: state.user ? { ...state.user, avatar_url, phone, bio, full_name, role, company_id } as typeof state.user : null
          }));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}

