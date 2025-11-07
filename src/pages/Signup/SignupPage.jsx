import SignupForm from './SignupForm';
import activities from 'constants/activities';

export default function SignupPage() {
  const handleSignup = (data) => {
    console.log('회원가입 제출 데이터:', data);
    alert("회원가입했습니다. 현재 mock이라 적용 x");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-[600px] rounded-xl bg-white p-8 shadow-lg mb-16 mt-4 mx-4">
        <h1 className="mb-6 text-2xl font-bold text-center">회원가입</h1>
        <SignupForm onSubmit={handleSignup} activities={activities} />
      </div>
    </div>
  );
}
