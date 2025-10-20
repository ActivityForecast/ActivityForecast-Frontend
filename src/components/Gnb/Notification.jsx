import { useEffect, useState } from 'react';
import { ReactComponent as AlarmIcon } from 'assets/icons/alarm.svg';

export default function Notification() {
  const [open, setOpen] = useState(false);

  // 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded hover:bg-gray-100"
        aria-label="알림 열기"
      >
        <AlarmIcon />
        {/* 빨간 점인데 만약 알림이 없으면 제거하는 방향 검토중*/}
        <span className="absolute top-1 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* 오른쪽 사이드패널 닫기 버튼은 디자인 고민 중 */}
          <aside className="fixed right-0 top-0 h-full w-[320px] sm:w-[360px] bg-white border-l shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">알림</h2>
              <button
                onClick={() => setOpen(false)}
                className="px-2 py-1 text-sm rounded hover:bg-gray-100"
              >
                닫기
              </button>
            </div>

            {/* 임시 목록 후에 map으로 실제 데이터 나열하기*/}
            <ul className="space-y-3">
              <li className="text-sm flex flex-col gap-2">
                활동하조 크루에 가입되었습니다.
                <span className="text-gray-400">5분 전</span>
              </li>
              <hr />
              <li className="text-sm flex flex-col gap-2">
                농구하조 크루에서 10월 20일 일정이 생성되었습니다.
                <span className="text-gray-400">1시간 전</span>
              </li>
            </ul>
          </aside>
        </>
      )}
    </>
  );
}
