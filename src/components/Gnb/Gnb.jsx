import ProfileDropdown from './ProfileDropdown';
import LocationSelector from './LocationSelector';
import Notification from './Notification';
import Menu from './Menu';
import Home from './Home';
import LoginMenu from './LoginMenu';

function Gnb() {
  return (
    <header className="flex items-center justify-between h-14 px-2 sm:px-6 border-b bg-white">
      <div className="flex items-center gap-1 sm:gap-4">
        <Menu />
        <Home />
      </div>
      <LocationSelector />
      <div className="flex items-center gap-1 sm:gap-2">
        <LoginMenu /> {/* 로그인과 프로필 조건부 렌더링 추가 예정 */}
        <ProfileDropdown />
        <Notification />
      </div>
    </header>
  );
}

export default Gnb;
