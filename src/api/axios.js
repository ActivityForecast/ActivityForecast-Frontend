
import axios from 'axios';
import { useAuthStore } from 'stores/auth';

const BASE_URL = process.env.REACT_APP_API_BASE_URL

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const url = config.url || '';
  const skipAuth =
    /\/auth\/login$/.test(url) ||
    /\/auth\/signup$/.test(url) ||
    /\/auth\/refresh$/.test(url) ||
    /\/oauth2\//.test(url);

  if (skipAuth) {
    if (config.headers && 'Authorization' in config.headers) {
      delete config.headers.Authorization;
    }
    return config;
  }

  const { accessToken, tokenType } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `${tokenType || 'Bearer'} ${accessToken}`;
  }
  return config;
});