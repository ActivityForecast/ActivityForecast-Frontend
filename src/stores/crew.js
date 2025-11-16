import { create } from 'zustand';
import * as Crew from 'api/crew';

export const useCrewStore = create((set, get) => ({
  myCrews: [],
  crewDetails: {}, // crewId -> crew detail
  schedulesByCrewId: {}, // crewId -> schedules array
  statisticsByCrewId: {}, // crewId -> statistics
  isLoading: false,

  // 크루 목록 로드
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

  // 크루 상세 조회
  loadCrewDetail: async (crewId) => {
    try {
      const detail = await Crew.getCrew(crewId).catch(() => null);
      if (detail) {
        set({
          crewDetails: { ...get().crewDetails, [crewId]: detail },
        });
      }
      return detail;
    } catch (error) {
      return null;
    }
  },

  // 크루 생성
  addCrew: async (payload) => {
    const created = await Crew.createCrew(payload).catch(() => undefined);
    if (!created || (typeof created === 'object' && Object.keys(created).length === 0)) {
      // Backend may return 201 with empty body; reload list to reflect server state
      return await get().loadMyCrews();
    }
    set({ myCrews: [...get().myCrews, created] });
    return created;
  },

  // 크루 가입 (inviteCode로)
  joinByCode: async (inviteCode) => {
    const joined = await Crew.joinCrew(inviteCode).catch(() => null);
    if (joined) {
      // 가입 성공 시 목록 새로고침
      await get().loadMyCrews();
    }
    return joined;
  },

  // 크루 통계 조회
  loadCrewStatistics: async (crewId) => {
    try {
      const stats = await Crew.getCrewStatistics(crewId).catch(() => null);
      if (stats) {
 
       
        set({
          statisticsByCrewId: { ...get().statisticsByCrewId, [crewId]: stats },
        });
      }
      return stats;
    } catch (error) {
      return null;
    }
  },

  // 크루 일정 조회
  loadCrewSchedules: async (crewId, year, month) => {
    try {
      const schedules = await Crew.getCrewSchedules(crewId, year, month).catch((error) => {
        console.error('일정 조회 GET 요청 오류:', error);
        console.error('에러 응답:', error?.response?.data);
        return [];
      });
      set({
        schedulesByCrewId: { ...get().schedulesByCrewId, [crewId]: schedules },
      });
      return schedules;
    } catch (error) {
      console.error('일정 조회 오류:', error);
      console.error('에러 응답:', error?.response?.data);
      return [];
    }
  },

  // 전체 크루 일정 조회
  loadAllCrewSchedules: async (year, month) => {
    try {
      const schedules = await Crew.getAllCrewSchedules(year, month).catch((error) => {
        console.error('전체 일정 조회 GET 요청 오류:', error);
        console.error('에러 응답:', error?.response?.data);
        return [];
      });
      return schedules;
    } catch (error) {
      console.error('전체 일정 조회 오류:', error);
      console.error('에러 응답:', error?.response?.data);
      return [];
    }
  },

  // 크루 일정 생성
  addCrewSchedule: async (crewId, schedulePayload) => {
    try {
      const created = await Crew.createCrewSchedule(crewId, schedulePayload);
      if (created) {
        // 일정 생성 후 해당 크루의 일정 목록 새로고침
        const currentSchedules = get().schedulesByCrewId[crewId] || [];
        set({
          schedulesByCrewId: {
            ...get().schedulesByCrewId,
            [crewId]: [...currentSchedules, created],
          },
        });
      }
      return created;
    } catch (error) {
      console.error('일정 생성 API 오류:', error);
      console.error('요청 바디:', schedulePayload);
      console.error('에러 응답 전체:', error?.response);
      console.error('에러 응답 데이터:', error?.response?.data);
      console.error('에러 상태 코드:', error?.response?.status);
      throw error; // 에러를 다시 throw하여 상위에서 처리할 수 있도록
    }
  },

  // 크루 일정 삭제
  removeCrewSchedule: async (crewId, crewScheduleId) => {
    try {
      await Crew.deleteCrewSchedule(crewId, crewScheduleId).catch(() => {});
      // 일정 삭제 후 목록에서 제거
      const currentSchedules = get().schedulesByCrewId[crewId] || [];
      set({
        schedulesByCrewId: {
          ...get().schedulesByCrewId,
          [crewId]: currentSchedules.filter((s) => s.crewScheduleId !== crewScheduleId),
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  // 크루 멤버 초대
  inviteMember: async (crewId, invitedUserId) => {
    try {
      const member = await Crew.inviteCrewMember(crewId, invitedUserId).catch(() => null);
      if (member) {
        // 초대 성공 시 크루 상세 정보 새로고침
        await get().loadCrewDetail(crewId);
        await get().loadMyCrews();
      }
      return member;
    } catch (error) {
      return null;
    }
  },

  // 크루 멤버 탈퇴/삭제
  removeMember: async (crewId, targetUserId) => {
    try {
      await Crew.removeCrewMember(crewId, targetUserId).catch(() => {});
      // 멤버 삭제 후 크루 상세 정보 새로고침
      await get().loadCrewDetail(crewId);
      await get().loadMyCrews();
      return true;
    } catch (error) {
      return false;
    }
  },
}));


