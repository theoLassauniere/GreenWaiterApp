import AppButton from '../common/app-button/app-button.tsx';
import './sidebar.scss';
import type { PageType } from '../../models/Pages.ts';

type SidebarProps = {
  onSelect: (page: PageType) => void;
  currentPage: PageType;
};

export default function Sidebar({ onSelect, currentPage }: Readonly<SidebarProps>) {
  return (
    <div className="sidebar-container">
      <AppButton
        label="Tables"
        onClick={() => onSelect('tables')}
        className={currentPage === 'tables' ? 'selected' : ''}
      />
      <AppButton
        label="Menu"
        onClick={() => onSelect('menu')}
        className={currentPage === 'menu' || currentPage === 'group-menu' ? 'selected' : ''}
      />
      <AppButton
        label="Commandes"
        onClick={() => onSelect('commandes')}
        className={currentPage === 'commandes' ? 'selected' : ''}
      />
      {currentPage === 'paiement' && (
        <AppButton label="Paiement" onClick={() => onSelect('paiement')} className="selected" />
      )}
    </div>
  );
}
