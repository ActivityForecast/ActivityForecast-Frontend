// src/stores/auth.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as Auth from '../api/auth';

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
        set((s) => ({ user: { ...s.user, ...me } }));
        return me;
      },

      signup: async (payload) => {
        set({ isLoading: true });
        try {
          const data = await Auth.signup(payload);
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            tokenType: data.tokenType,
            user: data.user,
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
          set({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            tokenType: data.tokenType,
            user: data.user,
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
          set((s) => ({
            user: {
              ...s.user,
              ...updated,
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
