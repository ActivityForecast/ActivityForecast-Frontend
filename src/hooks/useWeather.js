import { useEffect, useMemo, useState } from 'react';
import { useLocationStore } from 'stores/location';
import { getTodaySummary, getForecast, getAirQuality } from 'api/weather';
import { locationShape } from 'utils/locationShape';

const pad2 = (n) => String(n).padStart(2, '0');

const toLocalYMD = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const ymdDiff = (a, b) =>
  Math.floor((new Date(a).getTime() - new Date(b).getTime()) / 86400000);

function normalizeForecastItem(it) {
  if (!it) return null;
  const dt = it.dateTime || it.datetime || it.dt_txt;
  const temp = it.temperatureInCelsius ?? it.main?.temp;
  const icon = it.weather?.[0]?.icon;
  const cond =
    it.weatherConditionKorean ??
    it.weather?.[0]?.description ??
    it.weather?.[0]?.main;

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

export function useWeather(dateYmd, time) {
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
        const today = toLocalYMD(new Date());
        const diff = ymdDiff(dateYmd, today);

        const [hStr] = String(time || '').split(':');
        const parsed = parseInt(hStr, 10);
        const targetHour = Number.isFinite(parsed) ? parsed : 12;

        if (diff < 0) {
          const res = await getTodaySummary(coords, { signal: ac.signal });
          setState({ isLoading: false, error: null, data: res });
          return;
        }

        const res = await getForecast(coords, { signal: ac.signal });
        const list = res?.data?.list || res?.list || [];

        const withLocal = list
          .map((item) => {
            const dtSec = item.dt;
            if (dtSec === undefined || dtSec === null) return null;

            const local = new Date(dtSec * 1000); 
            return {
              item,
              localYmd: toLocalYMD(local),
              localHour: local.getHours(),
              local,
            };
          })
          .filter(Boolean)
          .filter((x) => x.localYmd === dateYmd);

        if (withLocal.length === 0) {
          setState({ isLoading: false, error: null, data: null });
          return;
        }

        let picked = withLocal.find((x) => x.localHour === targetHour);

        if (!picked) {
          withLocal.sort(
            (a, b) =>
              Math.abs(a.localHour - targetHour) -
              Math.abs(b.localHour - targetHour)
          );
          picked = withLocal[0];
        }

        const target = picked.item;

        const normalized = normalizeForecastItem(target);

        if (normalized) {
          try {
            const aq = await getAirQuality(coords, { signal: ac.signal });
            const overall =
              aq?.overallAirQualityKorean || aq?.airQualityStatusKorean;
            normalized.airQuality = overall;
            normalized.airQualityIndex = aq?.airQualityIndex;
          } catch (e) {
          }
        }

        setState({ isLoading: false, error: null, data: normalized });
      } catch (e) {
        if (!ac.signal.aborted) {
          setState({ isLoading: false, error: e, data: null });
        }
      }
    })();

    return () => ac.abort();
  }, [coords, dateYmd, time]);

  return state;
}
