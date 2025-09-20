import type { JSX } from 'react';
import './IconButton.css';

type ButtonProps = {
  icon?: string;
  onClick?: () => void;
  className?: string;
};

export default function IconButton({ onClick, icon, className }: ButtonProps): JSX.Element {
  const content = (
    <div className="IconButton" onClick={onClick}>
      <span className="material-icons">{icon ?? 'info'}</span>
    </div>
  );

  return className ? <div className={className}>{content}</div> : content;
}
