import { useState, useCallback, useEffect } from 'react';
import InputField from 'components/InputField';
import Button from 'components/Button';
import {
  validateNickname,
  validatePassword,
  validateConfirmPassword,
} from 'utils/formValidators';

export default function ProfileEditForm({ defaultUser, onCancel, onSaved }) {
  const [formData, setFormData] = useState({
    email: defaultUser.email,
    nickname: defaultUser.nickname,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isValidated, setIsValidated] = useState(false);

  const validateForm = useCallback(() => {
    const nameError = validateNickname(formData.nickname.trim()) || '';

    const wantsChangePw =
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword;

    let pwError = '';
    let confirmError = '';

    if (wantsChangePw) {
      pwError = validatePassword(formData.newPassword.trim()) || '';
      confirmError =
        validateConfirmPassword(formData.confirmPassword.trim()) || '';

      if (!confirmError && formData.newPassword !== formData.confirmPassword) {
        confirmError = '비밀번호가 일치하지 않습니다.';
      }
    }

    const hasError = [nameError, pwError, confirmError].some(Boolean);
    setIsValidated(!hasError);
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidated) return;
    // 추가: patch 요청
    console.log('프로필 수정 요청', formData);
    alert('저장되었습니다.');
    onSaved?.();
  };

  return (
    <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="email">아이디</label>
          <InputField
            id="email"
            type="email"
            value={formData.email}
            state="default-disabled"
          />
        </div>

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
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <InputField
            id="currentPassword"
            type="password"
            placeholder="현재 비밀번호를 입력해주세요."
            value={formData.currentPassword}
            onChange={handleChange}
            isPassword
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="newPassword">새 비밀번호</label>
          <InputField
            id="newPassword"
            type="password"
            placeholder="새 비밀번호를 입력해주세요."
            value={formData.newPassword}
            onChange={handleChange}
            validator={validatePassword}
            isPassword
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="confirmPassword">새 비밀번호 확인</label>
          <InputField
            id="confirmPassword"
            type="password"
            placeholder="새 비밀번호를 다시 한 번 입력해주세요."
            value={formData.confirmPassword}
            onChange={handleChange}
            validator={validateConfirmPassword}
            isPassword
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            styleType="outlined"
            className="w-1/2"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            type="submit"
            styleType="solid"
            className="w-1/2"
            disabled={!isValidated}
          >
            저장
          </Button>
        </div>
      </form>
    </section>
  );
}
