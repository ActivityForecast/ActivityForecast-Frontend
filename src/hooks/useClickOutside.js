import { useEffect, useRef } from 'react';

// 모달이나 메뉴, 사이드바 등에서 외부를 클릭할 시 닫히게 하는 코드입니다.
export default function useClickOutside(onClickOutside) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClickOutside?.();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [onClickOutside]);

  return ref;
}
