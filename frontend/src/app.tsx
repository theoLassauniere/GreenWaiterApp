import './app.scss';
import Sidebar from './components/sidebar/sidebar.tsx';
import { useState } from 'react';
import { Payment } from './pages/payment.tsx';
import Tables from './pages/tables.tsx';
import OrdersList from './pages/orders-list.tsx';
import ReadyNotification from './components/common/ready-notification/ready-notification.tsx';
import { Menu } from './pages/menu.tsx';
import { Pages, type PageType } from './models/Pages.ts';
import type { TableType } from './models/Table.ts';

function App() {
  const [page, setPage] = useState<PageType>(Pages.Tables);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [readyNotification, setReadyNotification] = useState<string | null>(null);
  const [tables, setTables] = useState<TableType[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);

  function handleSelectPage(newPage: PageType, tableNumber?: number) {
    if (newPage === Pages.Menu) {
      setSelectedCategory(null);
    }
    if (newPage === Pages.Paiement) {
      setSelectedTable(tables.find((table) => table.tableNumber === tableNumber) ?? null);
    }
    setPage(newPage);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Sidebar onSelect={handleSelectPage} />
      </div>
      <main>
        {page === Pages.Tables && (
          <Tables tables={tables} setTables={setTables} onSelectPage={handleSelectPage} />
        )}
        {page === Pages.Menu && (
          <Menu selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        )}
        {page === Pages.Commandes && <OrdersList tables={tables} onSelectPage={handleSelectPage} />}
        {page === Pages.Paiement && selectedTable && (
          <Payment table={selectedTable} onSelectPage={handleSelectPage} />
        )}
      </main>
      {readyNotification && (
        <ReadyNotification message={readyNotification} onClose={() => setReadyNotification(null)} />
      )}
    </div>
  );
}

export default App;
