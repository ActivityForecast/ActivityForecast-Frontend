import { useCallback, useEffect, useState } from 'react';
import InputField from 'components/InputField';
import Button from 'components/Button';
import {
  validateNickname,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from 'utils/formValidators';
import ActivitySelectModal from 'components/ActivitySelectModal';

export default function SignupForm({
  onSubmit,
  initialFormData = {
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  activities = [],
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [isValidated, setIsValidated] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors = {
      nickname: validateNickname(formData.nickname.trim()) || '',
      email: validateEmail(formData.email.trim()) || '',
      password: validatePassword(formData.password.trim()) || '',
      confirmPassword:
        validateConfirmPassword(
          formData.confirmPassword.trim(),
          formData.password.trim()
        ) || '',
    };
    const hasError = Object.values(newErrors).some((msg) => msg);
    setIsValidated(!hasError);
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenActivityModal = (e) => {
    e.preventDefault();
    if (!isValidated) return;
    setIsActivityModalOpen(true);
  };

  const handleConfirmActivities = (payload) => {
    setIsActivityModalOpen(false);
    onSubmit?.({
      nickname: formData.nickname,
      email: formData.email,
      password: formData.password,
      activities: payload,
    });
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-10 bg-transparent font-medium">
        <div className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="nickname">이름</label>
            <InputField
              id="nickname"
              type="text"
              placeholder="이름을 입력해주세요."
              value={formData.nickname}
              onChange={handleChange}
              validator={validateNickname}
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="email">이메일</label>
            <InputField
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요."
              value={formData.email}
              onChange={handleChange}
              validator={validateEmail}
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="password">비밀번호</label>
            <InputField
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={formData.password}
              onChange={handleChange}
              validator={validatePassword}
              isPassword={true}
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <InputField
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 한 번 입력해주세요."
              value={formData.confirmPassword}
              onChange={handleChange}
              validator={(v) => validateConfirmPassword(v, formData.password)}
              isPassword={true}
            />
          </div>
        </div>

        <Button
          type="button"
          styleType="solid"
          size="py-3.5 w-full text-md"
          state="default"
          disabled={!isValidated}
          onClick={handleOpenActivityModal}
        >
          운동 선택하기
        </Button>
      </form>

      <ActivitySelectModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onConfirm={handleConfirmActivities}
        activities={activities}
      />
    </>
  );
}
