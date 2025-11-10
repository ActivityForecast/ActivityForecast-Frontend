import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Notification from './Notification';
import Menu from './Menu';
import Home from './Home';
import LoginMenu from './LoginMenu';
import ProfileDropdown from './ProfileDropdown';
import LocationSelector from './LocationSelector';
import { useAuthStore } from 'stores/auth';

function Gnb() {
  const location = useLocation();
  const { user, accessToken, loadMe } = useAuthStore();

  useEffect(() => {
    if (accessToken && !user && typeof loadMe === 'function') {
      loadMe().catch(() => {});
    }
  }, [accessToken, user, loadMe]);

  const renderCenterSlot = () => {
    if (location.pathname === '/') 
      return <LocationSelector />;
    if (location.pathname.startsWith('/history')) 
      return <span className="text-base sm:text-lg font-semibold select-none">히스토리</span>;
    if (location.pathname.startsWith('/mypage'))  
      return <span className="text-base sm:text-lg font-semibold select-none">마이페이지</span>;
    if (location.pathname.startsWith('/crew'))    
      return <span className="text-base sm:text-lg font-semibold select-none">크루페이지</span>;
    return null;
  };

  return (
    <header className="flex items-center justify-between h-14 px-2 sm:px-6 border-b bg-white z-50">
      <div className="flex items-center sm:gap-2">
        <Menu />
        <Home />
      </div>

      <div className="flex items-center">{renderCenterSlot()}</div>

      <div className="flex items-center gap-1 sm:gap-2">
        {user ? <><ProfileDropdown /> <Notification /></> : <LoginMenu />}
        
      </div>
    </header>
  );
}

export default Gnb;
