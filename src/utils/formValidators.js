export const validateNickname = (value) => {
  if (!value.trim()) return '이름은 필수 입력입니다.';
  if (value.length < 2) return '이름은 최소 2자 이상이어야 합니다.';
  if (value.length >= 20) return '이름은 최대 20자까지 가능합니다.';
  if (/^\d+$/.test(value)) return '이름은 숫자로만 구성될 수 없습니다.';
  return undefined;
};

export const validateEmail = (value) => {
  if (!value.trim()) return '이메일은 필수 입력입니다.';
  if (!value.includes('@')) return '이메일 형식으로 작성해주세요.';
  return undefined;
};

export const validatePassword = (value) => {
  if (!value.trim()) return '비밀번호는 필수 입력입니다.';
  if (value.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다.';

  const hasNumber = /[0-9]/.test(value);
  const hasLetter = /[A-Za-z]/.test(value);
  const hasSpecialChar = /[!@#$%^&*]/.test(value);

  if (!hasNumber || !hasLetter || !hasSpecialChar) {
    return '비밀번호는 숫자, 영문, 특수문자를 모두 포함해야 합니다.';
  }

  return undefined;
};

export const validateConfirmPassword = (value) => {
  if (!value.trim()) return '비밀번호 확인을 입력해주세요.';

  const passwordInput = document.getElementById('password');
  const password = passwordInput?.value || '';

  if (value !== password) return '비밀번호가 일치하지 않습니다.';

  return undefined;
};

export const validatePasswordOptional = (value) => {
  // 비어 있으면 변경 안 하는 것이므로 통과
  if (!value.trim()) return undefined;
  // 값을 넣었다면 기존 규칙으로 검증
  return validatePassword(value);
};

// ✅ 프로필 수정용: "새 비번"과의 일치 확인 (DOM 접근 없이 클로저로 비교)
export const makeConfirmPasswordValidator = (newPasswordValueOrGetter) => {
  return (value) => {
    const newPw =
      typeof newPasswordValueOrGetter === 'function'
        ? newPasswordValueOrGetter()
        : newPasswordValueOrGetter;

    const hasNew = !!(newPw && newPw.trim());
    const hasConfirm = !!(value && value.trim());

    // 새 비번을 안 쓰면 확인도 필요 없음
    if (!hasNew && !hasConfirm) return undefined;

    if (!hasConfirm) return '비밀번호 확인을 입력해주세요.';
    if (value !== newPw) return '비밀번호가 일치하지 않습니다.';
    return undefined;
  };
};

export const validateUserUpdated = (prevData, newData) => {
  const isNicknameChanged =
    prevData.nickname.trim() !== newData.nickname.trim();
  const isImageChanged = prevData.image !== newData.image;

  return isNicknameChanged || isImageChanged;
};
