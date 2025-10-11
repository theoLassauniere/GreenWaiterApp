import './app.scss';
import Sidebar from './components/sidebar/sidebar.tsx';
import { useRef, useState } from 'react';
import { Payment } from './pages/payment.tsx';
import Tables from './pages/tables.tsx';
import OrdersList from './pages/orders-list.tsx';
import ReadyNotification from './components/common/ready-notification/ready-notification.tsx';
import { Menu, type MenuHandle } from './pages/menu.tsx';
import { Pages, type PageType } from './models/Pages.ts';
import type { TableType } from './models/Table.ts';

function App() {
  const [page, setPage] = useState<PageType>(Pages.Tables);
  const [readyNotification, setReadyNotification] = useState<string | null>(null);
  const [tables, setTables] = useState<TableType[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [menuTableNumber, setMenuTableNumber] = useState<number | null>(null);
  const menuRef = useRef<MenuHandle>(null);

  function handleSelectPage(newPage: PageType, tableNumber?: number) {
    if (newPage === Pages.Paiement) {
      setSelectedTable(tables.find((table) => table.tableNumber === tableNumber) ?? null);
    }
    if (newPage === Pages.Menu) {
      if (page === Pages.Menu) {
        menuRef.current?.onReturn();
        return;
      }
      if (tableNumber != null) {
        setMenuTableNumber(tableNumber);
      }
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
        {page === Pages.Menu && menuTableNumber && (
          <Menu ref={menuRef} tableId={menuTableNumber} onSelectPage={handleSelectPage} />
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
