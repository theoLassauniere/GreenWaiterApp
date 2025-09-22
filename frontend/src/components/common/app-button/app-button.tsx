import './app-button.scss';

type ButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
};

export default function AppButton({ label, onClick, className = '' }: ButtonProps) {
  return (
    <button className={`custom-btn ${className}`} onClick={onClick}>
      {label}
    </button>
  );
}
