import { useState } from 'react';
import { ReactComponent as EditPencilIcon } from 'assets/icons/pencil.svg';
import Button from 'components/Button';
import ProfileEditForm from './ProfileEditForm';
import { useAuthStore } from 'stores/auth';

export default function ProfileEdit() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthStore();

  if (!isEditing) {
    return (
      <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-8">
        <div className="mb-4">
          <div className="text-xl font-semibold text-gray-900">
            {user.name || user.nickname}
          </div>
          <div className="mt-2 text-lg text-gray-600">
            <div>{user.email}</div>
            <div className="text-base">비밀번호: {'•'.repeat(8)}</div>
          </div>
        </div>

        <Button
          onClick={() => setIsEditing(true)}
          styleType="outlined"
          className="flex items-center justify-center gap-2 border-[#4484ff] w-full"
        >
          <EditPencilIcon />
          <span className="text-center text-base text-[#4484ff]">
            프로필 편집
          </span>
        </Button>
      </section>
    );
  }

  return (
    <ProfileEditForm
      defaultUser={user}
      onCancel={() => setIsEditing(false)}
      onSaved={() => setIsEditing(false)}
    />
  );
}
