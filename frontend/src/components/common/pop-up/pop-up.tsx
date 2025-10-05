import { type ReactNode, useEffect } from 'react';
import './pop-up.scss';
import IconButton from '../icon-button/icon-button.tsx';

export interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  className?: string;
}

export function PopUp({ isOpen, onClose, title, children, className = '' }: Readonly<PopupProps>) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={['popup-backdrop', className].filter(Boolean).join(' ')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-title">{title}</div>
          <IconButton className="popup-close" icon="close" onClick={onClose} />
        </div>
        <div className="popup-body">{children}</div>
      </div>
    </div>
  );
}
