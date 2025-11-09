import axios from 'axios';
import { useAuthStore } from '../stores/auth';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const { accessToken, tokenType } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `${tokenType || 'Bearer'} ${accessToken}`;
  }
  return config;
});
