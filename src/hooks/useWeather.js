import { useEffect, useMemo, useState } from 'react';
import { useLocationStore } from 'stores/location';
import { getTodaySummary, getForecast, getAirQuality } from 'api/weather';
import { locationShape } from 'utils/locationShape';

const toYMD = (d) => d.toISOString().slice(0,10);
const ymdDiff = (a,b) => Math.floor((new Date(a) - new Date(b)) / 86400000);

function normalizeForecastItem(it) {
  if (!it) return null;
  const dt = it.dateTime || it.datetime || it.dt_txt; 
  const temp = it.temperatureInCelsius ?? it.main?.temp;
  const icon = it.weather?.[0]?.icon;
  const cond = it.weatherConditionKorean ?? it.weather?.[0]?.description ?? it.weather?.[0]?.main;

  return {
    datetime: dt,
    temperature: typeof temp === 'number' ? Math.round(temp) : temp,
    temperatureUnit: '°C',
    condition: cond,
    airQuality: undefined,
    airQualityIndex: undefined,
    icon,
  };
}

export function useWeather(dateYmd) {
  const { selected } = useLocationStore();
  const coords = useMemo(() => locationShape(selected), [selected]);

  const [state, setState] = useState({
    isLoading: false,
    error: null,
    data: null,
  });

  useEffect(() => {
    if (!coords || !dateYmd) return;

    const ac = new AbortController();
    (async () => {
      setState({ isLoading: true, error: null, data: null });

      try {
        const today = toYMD(new Date());
        const diff = ymdDiff(dateYmd, today);

        if (diff <= 0) {
          const res = await getTodaySummary(coords, { signal: ac.signal });
          setState({ isLoading: false, error: null, data: res });
        } else {
          const res = await getForecast(coords, { signal: ac.signal });
          const list = res?.data?.list || res?.list || [];
          const target = list
            .filter((x) => {
              const s = x.dt_txt || x.dateTime || x.datetime || '';
              return typeof s === 'string' && s.startsWith(dateYmd);
            })
            .sort((a, b) => {
              const ah = new Date(a.dt_txt || a.dateTime || a.datetime).getHours();
              const bh = new Date(b.dt_txt || b.dateTime || b.datetime).getHours();
              return Math.abs(12 - ah) - Math.abs(12 - bh);
            })[0];

          const normalized = normalizeForecastItem(target);
          try {
            const aq = await getAirQuality(coords, { signal: ac.signal });
            const overall = aq?.overallAirQualityKorean || aq?.airQualityStatusKorean;
            normalized.airQuality = overall;              
            normalized.airQualityIndex = aq?.airQualityIndex; 
          } catch (_) {
          }
          setState({ isLoading: false, error: null, data: normalized });
        }
      } catch (e) {
        if (!ac.signal.aborted) setState({ isLoading: false, error: e, data: null });
      }
    })();

    return () => ac.abort();
  }, [coords, dateYmd]);

  return state;
}
