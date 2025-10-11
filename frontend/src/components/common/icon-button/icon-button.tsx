import type { JSX } from 'react';
import './icon-button.scss';

type ButtonProps = {
  icon?: string;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  color?: string;
};

export default function IconButton({ onClick, icon, className, color }: ButtonProps): JSX.Element {
  const content = (
    <div className="IconButton" onClick={onClick}>
      <span className="material-icons" style={color ? { color } : undefined}>
        {icon ?? 'info'}
      </span>
    </div>
  );

  return className ? <div className={className}>{content}</div> : content;
}
