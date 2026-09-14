import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthService, type ResolvedUser } from '../services/auth.service';
import { toAppError } from '../utils/errors';

export type User = ResolvedUser;

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  initialize: () => void;
  refreshUser: () => Promise<void>;
}

type SetState = (state: Partial<AuthState>) => void;

async function resolveSession(set: SetState) {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session?.user) {
    set({ user: null, isAuthenticated: false, isInitializing: false });
    return;
  }

  try {
    const response = await AuthService.resolveUser(session.user.id, session.user.email!);
    set({ user: response.data, isAuthenticated: true, isInitializing: false });
  } catch (err) {
    const appErr = toAppError(err);
    console.error(`[auth] resolveSession failed (${appErr.code}):`, appErr.message);
    set({ user: null, isAuthenticated: false, isInitializing: false });
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  login: (user) => set({ user, isAuthenticated: true }),

  logout: async () => {
    set({ user: null, isAuthenticated: false });
    await AuthService.signOut();
  },

  initialize: async () => {
    await resolveSession(set);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!newSession?.user) {
        set({ user: null, isAuthenticated: false, isInitializing: false });
        return;
      }

      try {
        const response = await AuthService.resolveUser(newSession.user.id, newSession.user.email!);
        set({ user: response.data, isAuthenticated: true, isInitializing: false });
      } catch (err) {
        const appErr = toAppError(err);
        console.error(`[auth] onAuthStateChange failed (${appErr.code}):`, appErr.message);
        set({ user: null, isAuthenticated: false, isInitializing: false });
      }
    });

    return () => subscription.unsubscribe();
  },

  refreshUser: async () => {
    await resolveSession(set);
  },
}));
