import { api } from './axios';

const unwrap = (res) => res.data?.data ?? res.data;

export const signup = (body) => api.post('/auth/signup', body).then(unwrap);
export const login = (body) => api.post('/auth/login', body).then(unwrap);
export const logout = () => api.post('/auth/logout').then(unwrap);
export const fetchMe = () => api.get('/auth/me').then(unwrap);
