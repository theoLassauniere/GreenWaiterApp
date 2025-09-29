import './App.scss';
import { mockTables } from './mocks/tables';
import Sidebar from './components/sidebar/sidebar.tsx';
import { useState, useEffect } from 'react';
import { TableService } from './services/table-service.tsx';
import { Payment } from './pages/payment.tsx';
import type { TableProps } from './components/tables/table/table.tsx';
import Tables from './pages/tables.tsx';
import OrdersList from './pages/orders-list.tsx';
import ReadyNotification from './components/common/ready-notification/ready-notification.tsx';
import { Menu } from './pages/menu.tsx';

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

  useEffect(() => {
    async function seedTables() {
      try {
        let existing = await TableService.listAllTables();
        if (existing.length === 0) {
          for (const table of mockTables) {
            await TableService.addTable({ tableNumber: table.tableNumber });
            if (table.occupied) {
              await TableService.openTable({
                tableNumber: table.tableNumber,
                customersCount: table.capacity ?? 2,
              });
            }
          }
        } else {
          for (const mock of mockTables) {
            const found = existing.find((t) => t.tableNumber === mock.tableNumber);
            if (!found) {
              if (mock.occupied) {
                await TableService.openTable({
                  tableNumber: mock.tableNumber,
                  customersCount: mock.capacity ?? 2,
                });
              }
            } else if (mock.occupied && !found.occupied) {
              await TableService.openTable({
                tableNumber: mock.tableNumber,
                customersCount: mock.capacity ?? 2,
              });
            }
          }
        }
        existing = await TableService.listAllTables();
        setTables(existing);
      } catch (err) {
        console.error('Erreur init tables', err);
      }
    }

    seedTables();
    setReadyNotification('Table 3 est prête à être servie !');
  }, []);

  return (
    <div className="app">
      <div className="sidebar">
        <Sidebar onSelect={handleSelectPage} />
      </div>
      <main>
        {page === 'tables' && <Tables tables={tables} />}
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
