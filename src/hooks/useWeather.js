import { useEffect, useMemo, useState } from 'react';
import { useLocationStore } from 'stores/location';
import { getTodaySummary } from 'api/weahter';
import { locationShape } from 'utils/loacationShape';

export function useWeather() {
  const { selected } = useLocationStore();
  const coords = useMemo(() => locationShape(selected), [selected]);

  const [state, setState] = useState({
    isLoading: false,
    error: null,
    data: null,
    coords: null,
  });

  useEffect(() => {
    if (!coords) {
      setState((s) => ({ ...s, data: null, error: null, coords: null }));
      return;
    }
    const ac = new AbortController();
    (async () => {
      setState({ isLoading: true, error: null, data: null, coords });
      try {
        const res = await getTodaySummary(coords, { signal: ac.signal });
        setState({ isLoading: false, error: null, data: res, coords });
      } catch (e) {
        if (ac.signal.aborted) return;
        setState({ isLoading: false, error: e, data: null, coords });
      }
    })();
    return () => ac.abort();
  }, [coords]);

  return { ...state };
}
