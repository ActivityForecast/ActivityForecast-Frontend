import { useEffect, useMemo, useState } from 'react';
import Modal from 'components/Modal/Modal';

const pad2 = (n) => String(n).padStart(2, '0');
const toYMD = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const fromYMD = (s) => {
  if (!s) return new Date();
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
const formatKoreanDate = (d) =>
  `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

/* 시간은 당장 사용 안 할 것 같아서 주석처리
const makeTimeOptions = (stepMin = 30) => {
  const arr = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMin) {
      arr.push(`${pad2(h)}:${pad2(m)}`);
    }
  }
  return arr;
};
*/

const buildCalendar = (baseDate) => {
  const first = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const startDay = first.getDay(); 
  const start = new Date(first);
  start.setDate(1 - startDay);

  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + w * 7 + d);
      days.push(cur);
    }
    weeks.push(days);
  }
  return weeks;
};

export default function CalendarModal({
  isOpen,
  initialDate,       
  //initialTime = '15:30',
  min,              
  max,             
  title = '날짜를 선택해주세요',
  onApply,         
  onClose,
  containerStyle,
}) {

  const [selected, setSelected] = useState(fromYMD(initialDate || toYMD(new Date())));
  //const [time, setTime] = useState(initialTime);
  const [cursorMonth, setCursorMonth] = useState(() => {
    const d = initialDate ? fromYMD(initialDate) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const minDate = useMemo(() => (min ? fromYMD(min) : null), [min]);
  const maxDate = useMemo(() => (max ? fromYMD(max) : null), [max]);
  const weeks = useMemo(() => buildCalendar(cursorMonth), [cursorMonth]);
  //const timeOptions = useMemo(() => makeTimeOptions(30), []);

  useEffect(() => {
    if (isOpen) {
      const init = fromYMD(initialDate || toYMD(new Date()));
      setSelected(init);
      setCursorMonth(new Date(init.getFullYear(), init.getMonth(), 1));
      //setTime(initialTime || '15:30');
    }
  }, [isOpen, initialDate/*, initialTime*/]);

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const inViewMonth = (d) =>
    d.getFullYear() === cursorMonth.getFullYear() && d.getMonth() === cursorMonth.getMonth();

  const disabledByRange = (d) =>
    (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) ||
    (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()));

  const handlePrevMonth = () =>
    setCursorMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setCursorMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const apply = () => { onApply?.(toYMD(selected)); }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      isCloseOutsideClick
      containerStyle={{ width: 400, ...(containerStyle || {}) }}
    >
      <div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 items-center rounded-xl border border-gray-500 px-3 py-2 text-xs sm:text-sm font-medium text-gray-800 bg-white">
            {formatKoreanDate(selected)}
          </div>{/*
          <div className="flex items-center rounded-xl border border-gray-500 px-3 py-1.5 bg-white">
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-gray-800 outline-none"
            >
              {timeOptions.map((t) => {
                const [hh, mm] = t.split(':').map(Number);
                const ampm = hh < 12 ? '오전' : '오후';
                const h12 = hh % 12 === 0 ? 12 : hh % 12;
                const label = `${ampm} ${h12}:${pad2(mm)}`;
                return (
                  <option key={t} value={t}>{label}</option>
                );
              })}
            </select>
          </div>*/}
        </div>

        <div className="mt-3 rounded-2xl border border-gray-500 p-3">
          <div className="flex items-center justify-between mb-2 text-sm font-semibold text-gray-800">
            <button onClick={handlePrevMonth} className="px-2 py-1 rounded-md hover:bg-gray-100" aria-label="이전달">◀</button>
            <div>
              {cursorMonth.toLocaleString('en-US', { month: 'long' })} {cursorMonth.getFullYear()}
            </div>
            <button onClick={handleNextMonth} className="px-2 py-1 rounded-md hover:bg-gray-100" aria-label="다음달">▶</button>
          </div>
 
          <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-sm">
            {weeks.flat().map((d) => {
              const isOut = !inViewMonth(d);
              const isSel = isSameDay(d, selected);
              const disabled = disabledByRange(d);

              return (
                <button
                  key={toYMD(d)}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelected(d)}
                  className={[
                    'mx-auto flex h-9 w-9 items-center justify-center rounded-lg',
                    isSel
                      ? 'bg-blue-600 text-white'
                      : isOut
                        ? 'text-gray-300'
                        : 'text-gray-800 hover:bg-gray-100',
                    disabled && 'opacity-40 cursor-not-allowed',
                  ].filter(Boolean).join(' ')}
                  aria-label={toYMD(d)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
         <button onClick={apply} className="mt-4 w-full flex items-center justify-center h-11 text-lg font-semibold rounded-xl hover:bg-gray-200">
          완료
        </button>
      </div>
    </Modal>
  );
}