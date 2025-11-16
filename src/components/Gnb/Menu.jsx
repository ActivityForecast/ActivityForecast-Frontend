import { useState } from 'react';
import { ReactComponent as MenuIcon } from 'assets/icons/gnb_menu.svg';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import { ReactComponent as HomeIcon } from 'assets/icons/home.svg';
import { ReactComponent as CrewIcon } from 'assets/icons/crew.svg';
import { ReactComponent as HistoryIcon } from 'assets/icons/history.svg';
import useClickOutside from 'hooks/useClickOutside';
import MenuLink from './MenuLink';

const items = [
  {
    to: '/mypage',
    title: '마이페이지',
    desc: '내 정보 및 설정',
    Icon: HomeIcon,
  },
  {
    to: '/crew',
    title: '크루페이지',
    desc: '함께하는 크루 관리',
    Icon: CrewIcon,
  },
  {
    to: '/history',
    title: '히스토리',
    desc: '활동 기록 보기',
    Icon: HistoryIcon,
  },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ref = useClickOutside(close);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1 rounded hover:bg-gray-100 text-white"
      >
        <MenuIcon />
      </button>

      {open && (
        <div>
          <div className="fixed inset-0 z-10 bg-black/30" onClick={close} />

          <aside
            ref={ref}
            className="fixed left-0 z-20 top-0 h-full w-80 bg-white shadow-xl border-r
                       translate-x-0 transition-transform duration-300"
          >
            <header className="bg-[#0d99ff] mb-4   text-white px-4 py-4">
              <div className="text-lg font-semibold mb-2">메뉴</div>
              <div className="text-sm opacity-90">
                원하는 페이지로 이동하세요
              </div>

              <button
                onClick={close}
                className="absolute right-3 top-3 p-1 rounded hover:bg-white/20"
                aria-label="메뉴 닫기"
              >
                <CloseIcon />
              </button>
            </header>

            <nav className="p-3 space-y-8">
              {items.map((it) => (
                <MenuLink key={it.to} {...it} onClick={close} />
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
