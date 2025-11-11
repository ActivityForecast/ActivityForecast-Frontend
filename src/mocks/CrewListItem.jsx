import { useState } from 'react';
import CalendarBox from 'mocks/Calender';
import Modal, { ModalFooter } from 'components/Modal/Modal';
import InputField from 'components/InputField';
import Button from 'components/Button';
import ActivityWidget from 'mocks/ActivityWidget';

export default function CrewListItem({
  id,
  name = '농구하조',
  current = 3,
  max = 5,
  color = '#FC8385',
  events = [],
  onLeave,
  onShare,
  members = [],
}) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  // 일정 생성 모달 내부 상태
  const [activity, setActivity] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [gear, setGear] = useState('');

  const open = hovering || pinned;

  return (
    <div
      className="group relative w-full rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-300"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* 좌측 컬러 바 */}
      <span
        className="absolute inset-y-0 left-0 w-4"
        style={{ backgroundColor: color }}
      />

      {/* 상단 영역 */}
      <div className="flex items-center justify-between pl-8 pr-6 py-2">
        <div className="text-base font-semibold text-black">{name}</div>

        <div className="flex items-center gap-3">
          {/* 인원 표시 */}
          <div
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-white text-sm"
            style={{ backgroundColor: color }}
          >
            <svg width="16" height="16" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
                transform="rotate(-90 18 18)"
              />
            </svg>
            <span className="font-medium">
              {current}/{max}
            </span>
          </div>

          {/* 펼치기 삼각형 */}
          <button
            type="button"
            aria-label={open ? '접기' : '펼치기'}
            onClick={() => setPinned((p) => !p)}
            className="p-1 -mr-1 rounded hover:bg-gray-100 transition"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              className={`transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`}
            >
              <path d="M7 10l5 5 5-5z" fill={color} />
            </svg>
          </button>
        </div>
      </div>

      {/* 상세 정보 */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          open ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
        } px-6 pb-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 items-start">
          {/* 멤버 */}
          <section>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">멤버</h4>
            <div className="flex items-center gap-6">
              {(members || []).slice(0, 8).map((m, i) => {
                const displayName = m?.user?.name ?? m?.name ?? `멤버${i + 1}`;
                return (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                    <div className="text-xs text-gray-600 mt-1">{displayName}</div>
                  </div>
                );
              })}
              {(members || []).length === 0 && (
                <div className="text-xs text-gray-400">멤버가 없습니다</div>
              )}
            </div>
          </section>

          {/* 크루 일정  */}
          <section className="md:row-span-2 self-start">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              크루 일정
            </h4>
            <CalendarBox inline mode="mini" accent={color} events={events} />

            {/* 일정 생성/삭제 버튼 */}
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                className="rounded-full px-4 py-2 text-white shadow-sm"
                style={{ backgroundColor: color }}
                onClick={() => setOpenCreate(true)}
              >
                일정 생성
              </button>

              <button
                type="button"
                className="rounded-full px-4 py-2"
                style={{ backgroundColor: `${color}1A`, color }}
                onClick={() => alert('일정 삭제 UI는 추후 연결')}
              >
                일정 삭제
              </button>
            </div>
          </section>

          {/* 크루 활동  */}
          <section className="md:col-start-1">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              크루 활동
            </h4>

            <ActivityWidget
              accent={color}
              total={4}
              segments={[
                { label: '축구', count: 2 },
                { label: '러닝', count: 1 },
                { label: '농구', count: 1 },
              ]}
              gapClass="gap-2"
            />
          </section>
        </div>

        {/* 공유 / 탈퇴 */}
        <div className="flex gap-3 mt-5">
          <button
            className="flex-1 rounded-full text-white py-2"
            style={{ backgroundColor: color }}
            onClick={() => onShare?.(id)}
          >
            공유
          </button>
          <button
            className="flex-1 rounded-full text-white py-2"
            style={{ backgroundColor: color }}
            onClick={() => onLeave?.(id)}
          >
            탈퇴
          </button>
        </div>
      </div>

      {/* 일정 생성 모달 */}
      <Modal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        title="새 일정 만들기"
        style={{ '--modal-max-h-sm': 'calc(100dvh - 80px)' }}
      >
        <div className="flex flex-col gap-4 mt-2">
          {/* 활동 */}
          <label className="font-semibold text-black">활동</label>
          <div className="relative">
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-300 px-4 py-3 text-md sm:py-4 sm:text-lg focus:outline-none focus:ring-1"
            >
              <option value="" disabled>
                활동 선택
              </option>
              <option value="running">러닝</option>
              <option value="soccer">축구</option>
              <option value="basketball">농구</option>
              <option value="hiking">등산</option>
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ▾
            </span>
          </div>

          {/* 장소 */}
          <label className="font-semibold text-black">장소</label>
          <InputField
            id="place"
            type="text"
            placeholder="장소 검색"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />

          {/* 날짜 */}
          <label className="font-semibold text-black">날짜</label>
          <div className="flex items-center gap-2 -mt-1">
            <button
              type="button"
              className="rounded-full px-3 py-2 text-xs font-semibold"
              style={{ backgroundColor: `${color}1A`, color }}
            >
              AI 추천
            </button>
            <span className="text-xs text-gray-400">가장 쾌적한 시간 제안</span>
          </div>
          <InputField
            id="date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* 멤버 */}
          <label className="font-semibold text-black">멤버</label>
          <div className="flex items-center gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-300" />
            ))}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500"
            >
              +
            </button>
          </div>

          {/* 준비물 */}
          <label className="font-semibold text-black">준비물</label>
          <InputField
            id="gear"
            type="text"
            placeholder="리스트 입력"
            value={gear}
            onChange={(e) => setGear(e.target.value)}
          />

          <ModalFooter>
            <Button
              type="button"
              styleType="solid"
              className="mt-2 w-full"
              onClick={() => setOpenCreate(false)}
            >
              생성
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
