import './app.scss';
import Sidebar from './components/sidebar/sidebar.tsx';
import { useEffect, useRef, useState } from 'react';
import { Payment } from './pages/payment.tsx';
import Tables from './pages/tables.tsx';
import { GroupMenu } from './pages/group-menu.tsx';
import { OrdersList } from './pages/orders-list.tsx';
import ReadyNotification from './components/common/ready-notification/ready-notification.tsx';
import { Menu, type MenuHandle } from './pages/menu.tsx';
import { Pages, type PageType } from './models/Pages.ts';
import type { PreparationDto } from './services/order-service.ts';
import type { OrderState } from './models/OrderState.ts';
import { useTablesContext } from './contexts/use-tables.ts';

function App() {
  const { tables, getTable, updateTable } = useTablesContext();
  const [page, setPage] = useState<PageType>(Pages.Tables);
  const [currentTable, setCurrentTable] = useState<number | null>(null);
  const [currentGroupId, setCurrentGroupId] = useState<number | undefined>(undefined);
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
          state?: OrderState;
          orderId?: string;
        }>
      ).detail;
      if (!detail) return;

      const next = detail.state;
      if (!next) return;

      updateTable(detail.tableNumber, { orderState: next, orderId: detail.orderId });
    };

    globalThis.addEventListener('order:notify', onNotify as EventListener);
    globalThis.addEventListener('updateTable', onUpdateTable as EventListener);

    return () => {
      globalThis.removeEventListener('order:notify', onNotify as EventListener);
      globalThis.removeEventListener('updateTable', onUpdateTable as EventListener);
    };
  }, [tables, updateTable]);

  async function handleSelectPage(
    newPage: PageType,
    tableNumber?: number,
    preparationId?: string,
    groupId?: number
  ) {
    if (newPage === Pages.Menu) {
      if (page === Pages.Menu) {
        menuRef.current?.onReturn();
      }
    }
    if (tableNumber) {
      setCurrentTable(tableNumber);
    }
    if (tableNumber && preparationId) {
      updateTable(tableNumber, { orderId: preparationId });
    }
    if (groupId) {
      setCurrentGroupId(groupId);
    }
    setPage(newPage);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <Sidebar onSelect={handleSelectPage} currentPage={page} />
      </div>
      <main>
        {page === Pages.Tables && (
          <Tables onSelectPage={handleSelectPage} handleUpdateTable={updateTable} />
        )}
        {page === Pages.Menu && (
          <Menu
            ref={menuRef}
            table={currentTable ? getTable(currentTable) : undefined}
            onSelectPage={handleSelectPage}
          />
        )}
        {page === Pages.Commandes && (
          <OrdersList
            tables={tables}
            onSelectPage={handleSelectPage}
            handleUpdateTable={updateTable}
          />
        )}
        {page === Pages.Paiement &&
          (() => {
            let paymentTable;
            if (!currentGroupId && currentTable) {
              paymentTable = getTable(currentTable);
            }

            return (
              <Payment
                table={paymentTable}
                onSelectPage={handleSelectPage}
                groupId={currentGroupId}
                setGroupId={setCurrentGroupId}
              />
            );
          })()}
        {page === Pages.MenuGroupe && currentTable && (
          <GroupMenu
            table={getTable(currentTable)}
            onSelectPage={handleSelectPage}
            onReturn={() => handleSelectPage(Pages.Tables)}
          />
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
