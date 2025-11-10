// MypagePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from 'stores/auth';
import Option from './Option';
import ProfileEdit from './ProfileEdit';

export default function MypagePage() {
  const { user } = useAuthStore();
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      const t = setTimeout(() => nav('/', { replace: true }), 1000); 
      return () => clearTimeout(t);
    }
    setChecking(false);
  }, [user, nav]);

  if (checking) {
    return (
      <div className="bg-gray-50 min-h-screen px-4 py-8 flex items-center justify-center">
        <span className="text-gray-500 animate-pulse">로그인 상태를 확인하는 중…</span>
      </div>
    );
  }

  if (!user) return null; 

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 flex flex-col items-center">
      <ProfileEdit />
      <Option />
    </div>
  );
}
