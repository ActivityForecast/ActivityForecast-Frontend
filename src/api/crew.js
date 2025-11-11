import { api } from './axios';

const unwrap = (res) => res.data?.data ?? res.data;

export const listCrews = () => api.get('/api/crews').then(unwrap);
export const createCrew = (body) => api.post('/crew', body).then(unwrap);
export const joinCrew = (code) => api.post('/crew/join', { code }).then(unwrap);

export const listCrewMembers = (crewId) =>
  api.get(`/crew/${crewId}/members`).then(unwrap);

export const listCrewEvents = (crewId) =>
  api.get(`/crew/${crewId}/events`).then(unwrap);

export const createCrewEvent = (crewId, body) =>
  api.post(`/crew/${crewId}/events`, body).then(unwrap);


