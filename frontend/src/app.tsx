import './app.scss';
import Tables from './pages/tables.tsx';
import { mockTables } from './mocks/tables';
import Sidebar from './components/sidebar/sidebar.tsx';
import { useEffect, useState } from 'react';
import ReadyNotification from './components/common/ready-notification/ready-notification.tsx';
import OrdersList from './pages/orders-list.tsx';
import { Payment } from './pages/payment.tsx';
import { Menu } from './pages/menu.tsx';

function App() {
  const [page, setPage] = useState<'tables' | 'menu' | 'commandes' | 'paiement'>('tables');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [readyNotification, setReadyNotification] = useState<string | null>(null);
  const handleSelectPage = (newPage: typeof page) => {
    setPage(newPage);
    if (newPage === 'menu') {
      setSelectedCategory(null);
    }
  };

  useEffect(() => {
    setReadyNotification('Table 3 est prête à être servie !');
  }, []);

  return (
    <div className="app">
      <div className="sidebar">
        <Sidebar onSelect={handleSelectPage} />
      </div>
      <main>
        {page === 'tables' && <Tables tables={mockTables} />}
        {page === 'menu' && (
          <Menu selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        )}
        {page === 'commandes' && <OrdersList tables={mockTables} />}
        {page === 'paiement' && <Payment tableNumber={12} />}
      </main>
      {readyNotification && (
        <ReadyNotification message={readyNotification} onClose={() => setReadyNotification(null)} />
      )}
    </div>
  );
}

export default App;
