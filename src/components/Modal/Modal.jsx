import { cn } from 'utils/cn';
import { ReactComponent as CloseIcon } from 'assets/icons/close.svg';
import styles from './Modal.module.css';

const ModalFooter = ({ children }) => {
  return <div className={styles.footer}>{children}</div>;
};

export default function Modal({
  isOpen = false,
  hasCloseButton = true,
  isCloseOutsideClick = false, // 모달 바깥 클릭 시 모달이 닫힐 지 안 닫힐 지 정하는 부분
  title,
  position = 'center', // 'center' | 'top'
  children,
  onClose,
}) {
  if (!isOpen) return null;
  const handleClick = () => onClose?.();

  const handleBackdropClick = (e) => {
    if (isCloseOutsideClick && e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className={styles.modal} open={isOpen} onClick={handleBackdropClick}>
      <div className={cn(styles.container, position === 'top' && styles.top)}>
        {title && <h5 className={styles.title}>{title}</h5>}
        {children}
        {hasCloseButton && (
          <button
            type="button"
            className={styles.btnClose}
            onClick={handleClick}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}

export { ModalFooter };
