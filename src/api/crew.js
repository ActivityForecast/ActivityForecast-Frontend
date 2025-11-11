import { api } from './axios';

const unwrap = (res) => res.data?.data ?? res.data;

export const listCrews = () => api.get('/crews').then(unwrap);
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
export const joinCrew = (code) => api.post('/crew/join', { code }).then(unwrap);

export const listCrewMembers = (crewId) =>
  api.get(`/crew/${crewId}/members`).then(unwrap);

export const listCrewEvents = (crewId) =>
  api.get(`/crew/${crewId}/events`).then(unwrap);

export const createCrewEvent = (crewId, body) =>
  api.post(`/crew/${crewId}/events`, body).then(unwrap);


