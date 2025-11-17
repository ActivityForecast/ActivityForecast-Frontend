import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { History } from 'api/history';

function ymKey(year, month) {
  const y = Number(year) || new Date().getFullYear();
  const m = Number(month) || new Date().getMonth() + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      isLoading: false,
      statsByYm: {},
      listByYm: {},

      _ymKeyFromDate: (dateStr) => {
        try {
          if (!dateStr) return null;
          const d = new Date(dateStr);
          if (Number.isNaN(d.getTime())) return null;
          const y = d.getFullYear();
          const m = d.getMonth() + 1;
          return ymKey(y, m);
        } catch {
          return null;
        }
      },

      loadMonthlyStats: async (year, month) => {
        const key = ymKey(year, month);
        set({ isLoading: true });
        try {
          const stats = await History.getMonthlyStats(year, month);
          set((s) => ({ statsByYm: { ...s.statsByYm, [key]: stats } }));
          return stats;
        } catch (e) {
          // graceful fallback on server error
          console.error('loadMonthlyStats error', e?.response || e);
          const fallback = { year: Number(year), month: Number(month), totalCompletedCount: 0, activityCounts: {} };
          set((s) => ({ statsByYm: { ...s.statsByYm, [key]: fallback } }));
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      loadMonthlyList: async (year, month) => {
        const key = ymKey(year, month);
        set({ isLoading: true });
        try {
          const list = await History.listMonthly(year, month);
          set((s) => ({ listByYm: { ...s.listByYm, [key]: Array.isArray(list) ? list : [] } }));
          return list;
        } catch (e) {
          console.error('loadMonthlyList error', e?.response || e);
          set((s) => ({ listByYm: { ...s.listByYm, [key]: [] } }));
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      createHistoryItem: async (payload) => {
        const created = await History.createItem(payload);
        // best-effort: place into current month bucket if date present
        try {
          const dateStr = created?.scheduleDate || payload?.scheduleDate;
          if (dateStr) {
            const d = new Date(dateStr);
            const key = ymKey(d.getFullYear(), d.getMonth() + 1);
            set((s) => ({
              listByYm: { ...s.listByYm, [key]: [created, ...(s.listByYm[key] || [])] },
            }));
            // refresh stats for that month to reflect the new item immediately
            try {
              const stats = await History.getMonthlyStats(d.getFullYear(), d.getMonth() + 1);
              set((s) => ({ statsByYm: { ...s.statsByYm, [key]: stats } }));
            } catch {}
          }
        } catch {}
        return created;
      },

      updateHistoryItem: async (scheduleId, payload) => {
        // find existing item date to know which month to refresh after update
        let affectedYmKey = null;
        const stateBefore = get();
        Object.entries(stateBefore.listByYm || {}).some(([k, arr]) => {
          const it = Array.isArray(arr) ? arr.find((x) => String(x?.scheduleId ?? x?.id) === String(scheduleId)) : null;
          if (it) {
            affectedYmKey = k;
            return true;
          }
          return false;
        });

        const updated = await History.updateItem(scheduleId, payload).catch(() => null);
        // best-effort update within cached lists (immutably replace arrays so subscribers re-render)
        set((s) => {
          const next = { ...s.listByYm };
          Object.keys(next).forEach((k) => {
            const arr = next[k];
            if (!Array.isArray(arr)) return;
            const idx = arr.findIndex((it) => String(it?.scheduleId ?? it?.id) === String(scheduleId));
            if (idx >= 0) {
              const base = arr[idx] || {};
              const merged = { ...base, ...(updated || payload) };
              const newArr = arr.slice();
              newArr[idx] = merged;
              next[k] = newArr;
            }
          });
          return { listByYm: next };
        });
        // refresh stats for the affected month (if known)
        try {
          if (affectedYmKey) {
            const [y, m] = affectedYmKey.split('-');
            const year = Number(y);
            const month = Number(m);
            if (!Number.isNaN(year) && !Number.isNaN(month)) {
              const stats = await History.getMonthlyStats(year, month);
              set((s) => ({ statsByYm: { ...s.statsByYm, [affectedYmKey]: stats } }));
            }
          }
        } catch {}
        return updated || true;
      },
    }),
    {
      name: 'history-store',
      partialize: (s) => ({
        statsByYm: s.statsByYm,
        listByYm: s.listByYm,
      }),
    }
  )
);


