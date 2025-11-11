import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 위치를 전역으로 사용하기 위한 스토어
export const useLocationStore = create(
  persist(
    (set) => ({
      selected: null,
      setSelected: (loc) => set({ selected: loc }),
      clear: () => set({ selected: null }),
    }),
    { name: 'location-store' }
  )
);
