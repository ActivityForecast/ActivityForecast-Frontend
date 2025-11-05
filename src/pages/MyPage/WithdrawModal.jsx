import Button from 'components/Button';
import Modal, { ModalFooter } from 'components/Modal/Modal';

export default function WithdrawModal({ open, onClose, onConfirm }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="정말 탈퇴하시겠습니까?"
      isCloseOutsideClick={false}
      hasCloseButton={false}
      style={{ '--modal-w-sm': '384px' }}
    >
      <p className="mt-2 text-sm text-center text-gray-600">
        탈퇴 후에는 활동 기록을 복구할 수 없습니다.
      </p>
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
          onClick={onConfirm}
          state="danger"
          className="w-1/2 flex items-center justify-center"
        >
          확인
        </Button>
      </ModalFooter>
    </Modal>
  );
}
