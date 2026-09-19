import { create } from 'zustand';

interface AuthState {
  user: { uid: string; email?: string; displayName?: string } | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,

  initialize: () => {
    // Dev mode: auto-init as guest
    set({ user: null, initialized: true, loading: false });
  },

  signIn: async () => {
    set({ loading: true, error: null });
    // Mock sign-in for local dev
    set({
      user: { uid: 'dev-user', email: 'dev@sovereign.local', displayName: 'Dev User' },
      loading: false,
    });
  },

  signOut: async () => {
    set({ user: null, loading: false });
  },
}));
