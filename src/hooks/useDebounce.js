import { useEffect, useState } from 'react';

// 입력값이 잠시 멈출 때까지 기다렸다가 처리하는 훅
export function useDebounce(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
