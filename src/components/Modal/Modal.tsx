import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root') ?? document.body;

const Modal: React.FC<Props> = ({ children, onClose }) => {
  useEffect(() => {
    // Блокировка прокрутки
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      // Восстановление прокрутки
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
};

export default Modal;
