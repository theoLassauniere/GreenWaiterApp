// App.tsx
import './App.scss';
import Sidebar from './components/sidebar/sidebar.tsx';
import { useState } from 'react';
import { Payment } from './pages/payment.tsx';
import Tables from './pages/tables.tsx';
import OrdersList from './pages/orders-list.tsx';
import ReadyNotification from './components/common/ready-notification/ready-notification.tsx';
import { Menu } from './pages/menu.tsx';
import type { TableProps } from './components/tables/table/table.tsx';

function App() {
  const [page, setPage] = useState<'tables' | 'menu' | 'commandes' | 'paiement'>('tables');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [readyNotification, setReadyNotification] = useState<string | null>(null);
  const [tables, setTables] = useState<TableProps[]>([]);

  const handleSelectPage = (newPage: typeof page) => {
    setPage(newPage);
    if (newPage === 'menu') {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <Sidebar onSelect={handleSelectPage} />
      </div>
      <main>
        {page === 'tables' && <Tables tables={tables} setTables={setTables} />}
        {page === 'menu' && (
          <Menu selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        )}
        {page === 'commandes' && <OrdersList tables={tables} />}
        {page === 'paiement' && <Payment tableNumber={12} />}
      </main>
      {readyNotification && (
        <ReadyNotification message={readyNotification} onClose={() => setReadyNotification(null)} />
      )}
    </div>
  );
}

export default App;
