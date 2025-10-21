'use client';

import { useCallback, useEffect, useState } from 'react';
import InputField from 'components/InputField';
import Button from 'components/Button';
import { validateEmail, validatePassword } from 'utils/formValidators';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({
  onSubmit,
  initialFormData = {
    email: '',
    password: '',
  },
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [isValidated, setIsValidated] = useState(false);
  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    const newErrors = {
      email: validateEmail(formData.email.trim()) || '',
      password: validatePassword(formData.password.trim()) || '',
    };
    setIsValidated(!Object.values(newErrors).some((error) => error));
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidated) onSubmit(formData);
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-10 bg-transparent font-medium"
      >
        <div className="space-y-6">
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
            <div className="cursor-pointer text-right text-md text-[#0b0b0b]/50 underline hover:opacity-50 sm:text-lg">
              비밀번호를 잊으셨나요?
            </div>
          </div>
        </div>

        <Button
          type="submit"
          styleType="solid"
          size="py-3.5 w-full text-md"
          state="default"
          disabled={!isValidated}
        >
          로그인
        </Button>

        <Button
          type="button"
          styleType="outlined"
          size="py-3.5 w-full text-md"
          onClick={handleSignupClick}
        >
          회원가입
        </Button>
      </form>
    </>
  );
}
