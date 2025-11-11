import { api } from './axios';

const unwrap = (res) => (res && res.data ? res.data : res);

export async function getTodaySummary({ lat, lon }, { signal } = {}) {
  const { data } = await api.get('/weather/today-summary', {
    params: { lat, lon },
    signal,
  });
  return unwrap(data);
}

export async function getCurrent({ lat, lon }, { signal } = {}) {
  const { data } = await api.get('/weather/current', {
    params: { lat, lon },
    signal,
  });
  return unwrap(data);
}

export async function getForecast({ lat, lon }, { signal } = {}) {
  const { data } = await api.get('/weather/forecast', {
    params: { lat, lon },
    signal,
  });
  return unwrap(data);
}

export async function getAirQuality({ lat, lon }, { signal } = {}) {
  const { data } = await api.get('/weather/air-quality', {
    params: { lat, lon },
    signal,
  });
  return (data && data.data) ? data.data : data;
}