import { create } from 'zustand';
import * as Crew from 'api/crew';

export const useCrewStore = create((set, get) => ({
  myCrews: [],
  eventsByCrewId: {},
  isLoading: false,

  loadMyCrews: async () => {
    set({ isLoading: true });
    try {
      const crews = await Crew.listCrews().catch(() => []);
      set({ myCrews: crews });
      return crews;
    } finally {
      set({ isLoading: false });
    }
  },

  addCrew: async (payload) => {
    const created = await Crew.createCrew(payload);
    set({ myCrews: [...get().myCrews, created] });
    return created;
  },

  joinByCode: async (code) => {
    const joined = await Crew.joinCrew(code);
    set({ myCrews: [...get().myCrews, joined] });
    return joined;
  },

  loadEvents: async (crewId) => {
    const events = await Crew.listCrewEvents(crewId).catch(() => []);
    set({
      eventsByCrewId: { ...get().eventsByCrewId, [crewId]: events },
    });
    return events;
  },

  addEvent: async (crewId, eventPayload) => {
    const created = await Crew.createCrewEvent(crewId, eventPayload).catch(() => {
      // Fallback to local append if API is not ready
      return { id: Date.now(), ...eventPayload };
    });
    const current = get().eventsByCrewId[crewId] || [];
    set({
      eventsByCrewId: { ...get().eventsByCrewId, [crewId]: [...current, created] },
    });
    return created;
  },
}));


