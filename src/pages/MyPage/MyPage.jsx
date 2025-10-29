import Option from './Option';
import ProfileEdit from './ProfileEdit';

export default function MypagePage() {
  return (
    <dev className="bg-gray-50 min-h-screen px-4 py-8 flex flex-col items-center">
      <ProfileEdit />
      <Option />
    </dev>
  );
}
// 추가: 마이페이지는 api 연동하면서 alert를 전부 제거할 예정
