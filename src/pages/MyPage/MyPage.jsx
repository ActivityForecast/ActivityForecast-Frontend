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
