import { user } from 'mocks/user';
import { ReactComponent as EditPencilIcon } from 'assets/icons/pencil.svg';
import Button from 'components/Button';

export default function ProfileEdit() {
  const handleEditProfile = () => {
    alert('프로필 편집 화면으로 이동 예정');
  };

  return (
    <>
      <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-8">
        <div className="mb-4">
          <div className="text-xl font-semibold text-gray-900">
            {user.nickname}
          </div>
          <div className="mt-2 text-base text-gray-600">
            <div>{user.email}</div>
            <div>비밀번호: {user.passwordMasked}</div>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            가입일: {user.joinedAt}
          </div>
        </div>

        <Button
          onClick={handleEditProfile}
          styleType="outlined"
          className="flex items-center justify-center gap-2 border-[#4484ff] w-full"
        >
          <EditPencilIcon />
          <span className="text-center text-base text-[#4484ff]">
            프로필 편집
          </span>
        </Button>
      </section>
    </>
  );
}
