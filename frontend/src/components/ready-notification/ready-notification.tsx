import { useEffect } from 'react';
import './ready-notification.css';

type ReadyNotificationProps = {
  message: string;
  onClose: () => void;
};

export default function ReadyNotification({ message, onClose }: Readonly<ReadyNotificationProps>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification">
      <p>{message}</p>
    </div>
  );
}
