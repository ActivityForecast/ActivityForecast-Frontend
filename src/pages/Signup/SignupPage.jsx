import SignupForm from "./SignupForm";

export default function SignupPage() {
  const handleSignup = (data) => {
    alert("운동 선택하기를 클릭했습니다. 아직 기능 추가가 안 되었습니다~", data);
  };

  return (
     <div className="flex min-h-screen items-center justify-center bg-gray-50">
       <div className="w-[600px] rounded-xl bg-white p-8 shadow-lg">
         <h1 className="mb-6 text-2xl font-bold text-center">회원가입</h1>
         <SignupForm onSubmit={handleSignup} />
       </div>
     </div>
   );
 }