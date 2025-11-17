import { api } from './axios';

const unwrap = (res) => res.data?.data ?? res.data;

// 크루 목록 조회
export const listCrews = () => api.get('/crews').then(unwrap);

// 크루 상세 조회
export const getCrew = (crewId) => api.get(`/crews/${crewId}`).then(unwrap);

// 크루 생성
export const createCrew = (body) => {
  const payload = {
    crewName: body.crewName ?? body.name,
    description: body.description ?? '',
    maxCapacity:
      body.maxCapacity ?? body.max ?? body.capacity,
    colorCode: body.colorCode ?? '#83C8FC',
  };
  return api.post('/crews', payload).then(unwrap);
};

// 크루 가입 (inviteCode로)
export const joinCrew = (inviteCode) =>
  api.post('/crews/join', { inviteCode }).then(unwrap);

// 크루 통계 조회
export const getCrewStatistics = (crewId) =>
  api.get(`/crews/${crewId}/statistics`).then(unwrap);

// 특정 크루 일정 조회
export const getCrewSchedules = (crewId, year, month) =>
  api
    .get(`/crews/${crewId}/schedules`, {
      params: { year, month },
    })
    .then(unwrap);

// 전체 크루 일정 조회
export const getAllCrewSchedules = (year, month) =>
  api
    .get('/crews/schedules', {
      params: { year, month },
    })
    .then(unwrap);

// 크루 일정 생성
export const createCrewSchedule = (crewId, body) =>
  api.post(`/crews/${crewId}/schedules`, body).then(unwrap);

// 크루 일정 수정 (PUT)
export const updateCrewSchedule = (crewId, crewScheduleId, body) =>
  api.put(`/crews/${crewId}/schedules/${crewScheduleId}`, body).then(unwrap);

// 크루 일정 삭제
export const deleteCrewSchedule = (crewId, crewScheduleId) =>
  api.delete(`/crews/${crewId}/schedules/${crewScheduleId}`).then(unwrap);

// 크루 멤버 초대
export const inviteCrewMember = (crewId, invitedUserId) =>
  api
    .post(`/crews/${crewId}/members/invite`, { invitedUserId })
    .then(unwrap);

// 크루 멤버 탈퇴/삭제
export const removeCrewMember = (crewId, targetUserId) =>
  api.delete(`/crews/${crewId}/members/${targetUserId}`).then(unwrap);


