import SignupForm from './SignupForm';
import activities from 'constants/activities';
import { useAuthStore } from 'stores/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const { signup, isLoading } = useAuthStore();
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const handleSignup = async ({ name, email, password, preferredActivityIds }) => {
    setErr('');
    try {
      await signup({ name, email, password, preferredActivityIds });
      nav('/', { replace: true });
    } catch (e) {
      const msg = e?.response?.data?.message || '회원가입에 실패했어요.';
      setErr(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-[600px] rounded-xl bg-white p-8 shadow-lg mb-16 mt-4 mx-4">
        <h1 className="mb-2 text-2xl font-bold text-center">회원가입</h1>
        {err && <p className="mb-4 text-center text-sm text-red-600">{err}</p>}
        <SignupForm onSubmit={handleSignup} activities={activities} />
        {isLoading && <p className="mt-3 text-center text-sm text-gray-500">처리 중…</p>}
      </div>
    </div>
  );
}
