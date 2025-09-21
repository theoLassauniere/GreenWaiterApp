import AppButton from '../common/app-button/app-button.tsx';
import './sidebar.scss';

export default function Sidebar() {
  return (
    <div className="sidebar-container">
      <AppButton label="Tables" />
      <AppButton label="Menu" />
      <AppButton label="Commandes" />
      <AppButton label="Paiement" />
    </div>
  );
}
