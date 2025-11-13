import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Auth from '../api/auth';

function normalizePreferredIds(me) {
  if (Array.isArray(me?.preferredActivityIds))
    return me.preferredActivityIds.map(Number);
  if (Array.isArray(me?.preferences))
    return me.preferences.map((p) => Number(p.activityId));
  return [];
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      tokenType: 'Bearer',
      isLoading: false,

      isLoggedIn: () => !!get().accessToken,

      setAccessToken: (t) => set({ accessToken: t }),
      setUser: (u) => set({ user: u }),

      refreshMe: async () => {
        const me = await Auth.fetchMe();
        const preferred = normalizePreferredIds(me);
        set((s) => ({
          user: {
            ...s.user,
            ...me,
            preferredActivityIds: preferred,
          },
        }));
        return me;
      },

      signup: async (payload) => {
        set({ isLoading: true });
        try {
          const data = await Auth.signup(payload);
          const preferred = normalizePreferredIds(data.user);
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            tokenType: data.tokenType,
            user: { ...data.user, preferredActivityIds: preferred },
          });
          return data;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (payload) => {
        set({ isLoading: true });
        try {
          const data = await Auth.login(payload);
          const preferred = normalizePreferredIds(data.user);
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            tokenType: data.tokenType,
            user: { ...data.user, preferredActivityIds: preferred },
          });
          return data;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await Auth.logout();
        } catch (_) {}
        set({ user: null, accessToken: null, refreshToken: null });
      },

      updateProfile: async (payload) => {
        set({ isLoading: true });
        try {
          const updated = await Auth.updateUserProfile(payload);
          const preferred = normalizePreferredIds(updated);
          set((s) => ({
            user: {
              ...s.user,
              ...updated,
              ...(preferred.length ? { preferredActivityIds: preferred } : {}),
            },
          }));
          return updated;
        } catch (e) {
          if (e?.response?.status === 401) {
            set({ user: null, accessToken: null, refreshToken: null });
          }
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteAccount: async ({ password, reason }) => {
        set({ isLoading: true });
        try {
          await Auth.deleteUserAccount({ password, reason });
          set({ user: null, accessToken: null, refreshToken: null });
          return true;
        } finally {
          set({ isLoading: false });
        }
      },

      savePreferences: async (ids) => {
        set({ isLoading: true });
        try {
          await Auth.updateUserPreferences(ids);
          set((s) => ({
            user: {
              ...s.user,
              preferredActivityIds: Array.isArray(ids) ? ids.map(Number) : [],
            },
          }));
          return true;
        } catch (e) {
          if (e?.response?.status === 401) {
            set({ user: null, accessToken: null, refreshToken: null });
          }
          throw e;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        tokenType: s.tokenType,
      }),
    }
  )
);
