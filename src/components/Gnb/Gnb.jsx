import { useLocation } from 'react-router-dom';
// import ProfileDropdown from './ProfileDropdown';
import Notification from './Notification';
import Menu from './Menu';
import Home from './Home';
import LoginMenu from './LoginMenu';

import LocationSelector from './LocationSelector';

function Gnb() {
  const location = useLocation();
  const renderCenterSlot = () => {
    if (location.pathname === '/') return <LocationSelector />;
    if (location.pathname.startsWith('/history'))
      return (
        <span className="text-base sm:text-lg font-semibold select-none">
          히스토리
        </span>
      );
    if (location.pathname.startsWith('/mypage'))
      return (
        <span className="text-base sm:text-lg font-semibold select-none">
          마이페이지
        </span>
      );
    return null;
  };

  return (
    <header className="flex items-center justify-between h-14 px-2 sm:px-6 border-b bg-white">
      <div className="flex items-center gap-1 sm:gap-2">
        <Menu />
        <Home />
      </div>
      <div className="flex items-center">{renderCenterSlot()}</div>

      <div className="flex items-center gap-1 sm:gap-2">
        <LoginMenu /> {/* 추가: 로그인과 프로필 조건부 렌더링 예정 */}
        {/*    <ProfileDropdown /> */}
        <Notification />
      </div>
    </header>
  );
}

export default Gnb;
