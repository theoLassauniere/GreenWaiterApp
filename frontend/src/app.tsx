import './app.scss';
import Sidebar from './components/sidebar/sidebar.tsx';
import { useEffect, useRef, useState } from 'react';
import { Payment } from './pages/payment.tsx';
import Tables from './pages/tables.tsx';
import OrdersList from './pages/orders-list.tsx';
import ReadyNotification from './components/common/ready-notification/ready-notification.tsx';
import { Menu, type MenuHandle } from './pages/menu.tsx';
import { Pages, type PageType } from './models/Pages.ts';
import type { TableType } from './models/Table.ts';
import type { PreparationDto } from './services/order-service.ts';
import type { CommandState } from './models/CommandState.ts';
import { TableService } from './services/table-service.ts';

function App() {
  const [page, setPage] = useState<PageType>(Pages.Tables);
  const [tables, setTables] = useState<TableType[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [menuTableNumber, setMenuTableNumber] = useState<number | null>(null);
  const menuRef = useRef<MenuHandle>(null);
  const [readyNotification, setReadyNotification] = useState<{
    message: string;
    table?: number;
    item?: string;
  } | null>(null);

  useEffect(() => {
    const onNotify = (e: Event) => {
      const { message, preparation } =
        (e as CustomEvent<{ message?: string; preparation?: PreparationDto }>).detail ?? {};
      if (message) {
        setReadyNotification({
          message,
          table: preparation?.tableNumber,
          item: preparation?.menuItemShortName,
        });
      }
    };

    const onUpdateTable = (e: Event) => {
      const detail = (
        e as CustomEvent<{
          tableId?: string;
          tableNumber: number;
          state?: CommandState;
          commandId?: string;
        }>
      ).detail;
      if (!detail) return;

      const next = detail.state;
      if (!next) return;

      setTables((prev) =>
        prev.map((t) =>
          t.tableNumber === detail.tableNumber
            ? { ...t, commandState: next, commandId: detail.commandId ?? t.commandId }
            : t
        )
      );
    };

    window.addEventListener('order:notify', onNotify as EventListener);
    window.addEventListener('updateTable', onUpdateTable as EventListener);

    return () => {
      window.removeEventListener('order:notify', onNotify as EventListener);
      window.removeEventListener('updateTable', onUpdateTable as EventListener);
    };
  }, []);

  async function handleSelectPage(newPage: PageType, tableNumber?: number, preparationId?: string) {
    if (preparationId != null && tableNumber != null) {
      setTables((prev) =>
        prev.map((t) => (t.tableNumber === tableNumber ? { ...t, commandId: preparationId } : t))
      );
    }
    if (newPage === Pages.Tables) {
      setTables(await TableService.listAllTables());
    }
    if (newPage === Pages.Paiement) {
      setSelectedTable(tables.find((table) => table.tableNumber === tableNumber) ?? null);
    }
    if (newPage === Pages.Menu) {
      if (page === Pages.Menu) {
        menuRef.current?.onReturn();
        if (!tableNumber) setMenuTableNumber(null);
        return;
      }
      if (tableNumber != null) {
        setMenuTableNumber(tableNumber);
      } else {
        setMenuTableNumber(null);
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
        {page === Pages.Menu && (
          <Menu
            ref={menuRef}
            table={
              menuTableNumber !== null && menuTableNumber !== undefined
                ? tables.find((t) => t.tableNumber === menuTableNumber)
                : undefined
            }
            onSelectPage={handleSelectPage}
          />
        )}
        {page === Pages.Commandes && <OrdersList tables={tables} onSelectPage={handleSelectPage} />}
        {page === Pages.Paiement && selectedTable && (
          <Payment table={selectedTable} onSelectPage={handleSelectPage} />
        )}
      </main>
      {readyNotification && (
        <ReadyNotification
          message={`${readyNotification.message}`}
          onClose={() => setReadyNotification(null)}
        />
      )}
    </div>
  );
}

export default App;
