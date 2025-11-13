import Button from 'components/Button';
import InputField from 'components/InputField';
import Modal, { ModalFooter } from 'components/Modal/Modal';
import { useState } from 'react';

export default function WithdrawModal({ open, onClose, onConfirm }) {
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const canSubmit = password.trim().length > 7;

  const handleConfirm = () => {
    if (!canSubmit) return;
    onConfirm?.({ password: password.trim(), reason: reason.trim() });
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="정말 탈퇴하시겠습니까?"
      isCloseOutsideClick={false}
      hasCloseButton={false}
      style={{ '--modal-w-sm': '420px' }}
    >
      <div>
        <p className="mt-4 text-sm text-gray-700">
          탈퇴를 진행하려면 현재 비밀번호를 입력해주세요. (사유는 선택)
        </p>

        <div className="mt-4">
          <label className="block text-sm mb-1">현재 비밀번호 *</label>
          <InputField
            isPassword
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <label className="block text-sm mb-1">탈퇴 사유 (선택)</label>
          <textarea
            className="w-full rounded-md border px-3 py-2 text-base resize-none"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="서비스 개선에 도움이 됩니다."
          />
        </div>
      </div>
      <ModalFooter>
        <Button
          type="button"
          onClick={onClose}
          styleType="outlined"
          className="w-1/2 flex items-center justify-center"
        >
          취소
        </Button>
        <Button
          type="button"
          disabled={!canSubmit}
          onClick={handleConfirm}
          state="danger"
          className="w-1/2 flex items-center justify-center"
        >
          확인
        </Button>
      </ModalFooter>
    </Modal>
  );
}
