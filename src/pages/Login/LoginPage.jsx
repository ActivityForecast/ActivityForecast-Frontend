import { useAuthStore } from 'stores/auth';
import LoginForm from './LoginForm';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { user, login, isLoading } = useAuthStore();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    setError('');
    try {
      await login({ email: email.trim(), password });
      navigate('/home');
    } catch (e) {
      const msg = e?.response?.data?.message || '로그인에 실패했어요.';
      setError(msg);
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      const timer = setTimeout(() => {
        navigate('/home', { replace: true });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return <div className="p-8 text-center">로그인 확인 중…</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-[600px] rounded-xl bg-white p-8 shadow-lg mb-16 mt-4 mx-4">
        <h1 className="mb-6 text-2xl font-bold text-center">로그인</h1>
        {error && (
          <p className="mb-4 text-center text-sm text-red-600">{error}</p>
        )}
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
}
