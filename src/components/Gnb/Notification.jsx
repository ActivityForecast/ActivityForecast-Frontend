import { useState } from 'react';
import { ReactComponent as AlarmIcon } from 'assets/icons/alarm.svg';
import useClickOutside from 'hooks/useClickOutside';

export default function Notification() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // 패널 바깥 클릭 시 닫힘
  const ref = useClickOutside(close);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded hover:bg-gray-100"
      >
        <AlarmIcon />
        {/* 빨간 점인데 만약 알림이 없으면 제거하는 방향 검토중*/}
        <span className="absolute top-1 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
      </button>

      {open && (
        <div>
          <div className="fixed inset-0 bg-black/30" />
          <aside
            ref={ref}
            className="fixed right-0 top-0 h-full w-[320px] sm:w-[360px] bg-white border-l shadow-xl p-4 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">알림</h2>
              {/* 닫기 버튼 디자인은 검토중입니다. */}
              <button
                onClick={close}
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
        </div>
      )}
    </>
  );
}
