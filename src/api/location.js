import { api } from './axios';

const unwrap = (res) => (res && res.data ? res.data : res);

export async function searchLocations(keyword, { signal } = {}) {
  const { data } = await api.get('/locations/search', {
    params: { keyword },
    signal,
  });
  const rows = unwrap(data);
  return Array.isArray(rows) ? rows : [];
}

export async function externalSearchLocations({
  latitude,
  longitude,
  radiusKm = 10,
  activityId,
  keyword,
  signal,
} = {}) {
  const payload = { latitude, longitude, radiusKm, activityId, keyword };
  const { data } = await api.post('/locations/search/external', payload, { signal });
  const rows = unwrap(data);
  return Array.isArray(rows) ? rows : [];
}

export async function geocode(address, { signal } = {}) {
  const { data } = await api.post('/locations/geocode', { address }, { signal });
  return unwrap(data);
}

export async function reverseGeocode({ latitude, longitude }, { signal } = {}) {
  const { data } = await api.get('/locations/reverse-geocode', {
    params: { latitude, longitude },
    signal,
  });
  return unwrap(data);
}

export async function searchWithFallback({
  keyword,
  latitude,
  longitude,
  radiusKm = 10,
  activityId,
  signal,
} = {}) {
  const internal = await searchLocations(keyword, { signal });
  if (internal.length > 0) return internal;
  return externalSearchLocations({ latitude, longitude, radiusKm, activityId, keyword, signal });
}
