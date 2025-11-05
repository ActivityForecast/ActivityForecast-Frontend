// src/mocks/Calender.jsx  (파일명 유지)
// 기존 코드 유지 + 아래처럼 확장
import { useMemo, useState } from 'react';

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
//function sameDay(a,b){ return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }

export default function CalendarBox({
  inline = false,
  mode = 'default',
  accent = '#4FBFF2',
  events = [],
  className = '',
  size = 'md', // 'md' | 'lg' | 'xl' (mini는 mode로 제어)
  wide = false, // 가로만 더 넓게
}) {
  const [view, setView] = useState(new Date());

  // 달력 매트릭스 생성 (7x6)
  const matrix = useMemo(() => {
    const first = startOfMonth(view);
    const last = endOfMonth(view);
    const startIdx = (first.getDay() + 7) % 7; // 0=일
    const totalDays = last.getDate();
    const days = [];
    // 이전 달 채우기
    for (let i = 0; i < startIdx; i++) {
      const d = new Date(first);
      d.setDate(first.getDate() - (startIdx - i));
      days.push({ d, other: true });
    }
    // 이번 달
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(view.getFullYear(), view.getMonth(), i);
      days.push({ d, other: false });
    }
    // 다음 달 채우기
    while (days.length % 7 !== 0) {
      const d = new Date(days[days.length - 1].d);
      d.setDate(d.getDate() + 1);
      days.push({ d, other: true });
    }
    // 6주 보장
    while (days.length < 42) {
      const d = new Date(days[days.length - 1].d);
      d.setDate(d.getDate() + 1);
      days.push({ d, other: true });
    }
    return days;
  }, [view]);

  const eventMap = useMemo(() => {
    const m = new Map();
    for (const e of events) {
      const key = new Date(e.date);
      const k = `${key.getFullYear()}-${key.getMonth()}-${key.getDate()}`;
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(e);
    }
    return m;
  }, [events]);

  const monthLabel = `${view.getMonth() + 1}월`;

  const isMini = mode === 'mini';
  const isLg = !isMini && size === 'lg';
  const isXl = !isMini && size === 'xl';
  const wrapCls = isMini
    ? 'w-full max-w-[340px] rounded-lg border border-gray-200'
    : isXl
    ? `w-full ${wide ? 'max-w-[1100px]' : 'max-w-[960px]'} rounded-2xl shadow`
    : isLg
    ? `w-full ${wide ? 'max-w-[900px]' : 'max-w-[820px]'} rounded-2xl shadow`
    : `w-full ${wide ? 'max-w-[740px]' : 'max-w-[658px]'} rounded-xl shadow`;
  const cardPad = isMini ? 'p-3' : isXl ? 'p-8' : isLg ? 'p-6' : 'p-4';
  const dowClass = isMini
    ? 'text-xs py-1'
    : isXl
    ? 'text-lg py-4'
    : isLg
    ? 'text-base py-3'
    : 'text-sm py-2';
  const cellH = isMini ? 'h-8' : isXl ? 'h-14' : isLg ? 'h-12' : 'h-10';
  const cellW = isMini
    ? 'w-8'
    : isXl
    ? wide
      ? 'w-20'
      : 'w-14'
    : isLg
    ? wide
      ? 'w-16'
      : 'w-12'
    : wide
    ? 'w-14'
    : 'w-10';
  const numClass = isMini
    ? 'text-xs'
    : isXl
    ? 'text-xl'
    : isLg
    ? 'text-lg'
    : 'text-base';
  const navBtnSize = isMini
    ? 'w-8 h-8'
    : isXl
    ? 'w-12 h-12'
    : isLg
    ? 'w-10 h-10'
    : 'w-8 h-8';
  const navIconSize = isMini
    ? 'w-4 h-4'
    : isXl
    ? 'w-6 h-6'
    : isLg
    ? 'w-5 h-5'
    : 'w-4 h-4';
  const headerText = isMini
    ? 'text-sm font-semibold'
    : isXl
    ? 'text-3xl font-bold'
    : isLg
    ? 'text-2xl font-bold'
    : 'text-lg font-bold';

  return (
    <div
      className={`${
        inline ? 'relative' : 'fixed'
      } bg-white ${wrapCls} ${cardPad} ${className}`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="이전 달"
          onClick={() =>
            setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
          }
          className={`rounded-full bg-gray-100 flex items-center justify-center ${navBtnSize}`}
        >
          <svg viewBox="0 0 24 24" className={`${navIconSize}`}>
            <path
              d="M15 18L9 12l6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h3 className={headerText} style={{ color: accent }}>
          {monthLabel}
        </h3>

        <button
          type="button"
          aria-label="다음 달"
          onClick={() =>
            setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
          }
          className={`rounded-full bg-gray-100 flex items-center justify-center ${navBtnSize}`}
        >
          <svg viewBox="0 0 24 24" className={`${navIconSize}`}>
            <path
              d="M9 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 요일 */}
      <div className="grid grid-cols-7 mt-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d} className={`text-center text-gray-500 ${dowClass}`}>
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-7 gap-y-1">
        {matrix.map(({ d, other }, idx) => {
          const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          const hasEvt = eventMap.has(k);
          return (
            <div key={idx} className="flex items-center justify-center py-1">
              <div
                className={`grid place-items-center rounded-full border ${cellH} ${cellW} ${numClass}
                  ${
                    other
                      ? 'text-gray-300 border-transparent'
                      : 'text-black border-transparent'
                  }
                  hover:bg-gray-50`}
                style={
                  hasEvt
                    ? { borderColor: `${accent}55`, color: '#000' }
                    : undefined
                }
                title={
                  hasEvt
                    ? eventMap
                        .get(k)
                        .map((e) => e.label)
                        .join(', ')
                    : undefined
                }
              >
                {d.getDate()}
                {/* 이벤트 점 */}
                {hasEvt && (
                  <span
                    className="mt-0.5 block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
