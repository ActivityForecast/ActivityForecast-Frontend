import { useAuthStore } from 'stores/auth';
import LoginForm from './LoginForm';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoEmail, demoPassword } from 'mocks/user';

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

  const handleDemoLogin = async () => {
    setError('');
    try {
      await login({
        email: demoEmail,
        password: demoPassword,
      });
      navigate('/home');
    } catch (e) {
      const msg = e?.response?.data?.message || '데모 로그인에 실패했어요.';
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
        <button
          type="button"
          onClick={handleDemoLogin}
          className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          disabled={isLoading}
        >
          데모 계정으로 바로 로그인
        </button>
      </div>
    </div>
  );
}
