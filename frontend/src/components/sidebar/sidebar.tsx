import AppButton from '../common/app-button/app-button.tsx';
import './sidebar.scss';

type SidebarProps = {
  onSelect: (page: 'tables' | 'menu' | 'commandes' | 'paiement') => void;
};

export default function Sidebar({ onSelect }: SidebarProps) {
  return (
    <div className="sidebar-container">
      <AppButton label="Tables" onClick={() => onSelect('tables')} />
      <AppButton label="Menu" onClick={() => onSelect('menu')} />
      <AppButton label="Commandes" onClick={() => onSelect('commandes')} />
      <AppButton label="Paiement" onClick={() => onSelect('paiement')} />
    </div>
  );
}
