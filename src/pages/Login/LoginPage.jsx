import LoginForm from './LoginForm';

export default function LoginPage() {
  const handleLogin = (data) => {
    console.log('로그인 요청', data);
    // 로그인 API 연결 예정
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-[600px] rounded-xl bg-white p-8 shadow-lg mb-16 mt-4 mx-4">
        <h1 className="mb-6 text-2xl font-bold text-center">로그인</h1>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
