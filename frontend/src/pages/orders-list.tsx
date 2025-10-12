import './orders-list.scss';
import { Table } from '../components/tables/table/table.tsx';
import type { TableType } from '../models/Table.ts';
import type { PageType } from '../models/Pages.ts';
import { useEffect } from 'react';
import { OrderService } from '../services/order-service.ts';
import { CommandState } from '../models/CommandState.ts';

type OrdersListProps = {
  readonly tables: TableType[];
  readonly onSelectPage: (page: PageType, tableNumber?: number) => void;
  readonly refreshTables?: () => void;
};

export default function OrdersList({
  tables,
  onSelectPage,
  refreshTables,
}: Readonly<OrdersListProps>) {
  const preparation = tables.filter((t) => t.commandState === CommandState.PreparingInKitchen);
  const awaitingService = tables.filter((t) => t.commandState === CommandState.AwaitingService);
  const served = tables.filter((t) => t.commandState === CommandState.Served);

  const serveTable = async (table: TableType) => {
    try {
      if (!table.commandId) throw new Error('No commandId for table');
      await OrderService.serveToTable(table.commandId);
      refreshTables?.();
    } catch (err) {
      console.error('Error serving table', err);
    }
  };

  useEffect(() => {
    const handleOrderUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      console.log('Notification reçue:', detail.message);
      refreshTables?.();
    };

    window.addEventListener('order:notify', handleOrderUpdate);
    return () => window.removeEventListener('order:notify', handleOrderUpdate);
  }, [refreshTables]);

  return (
    <div className="orders-list">
      <div className="orders-column">
        <h2>Préparation</h2>
        {preparation.map((t) => (
          <Table key={t.id} table={t} onSelectPage={onSelectPage} />
        ))}
      </div>

      <div className="orders-column">
        <h2>À servir</h2>
        {awaitingService.map((t) => (
          <Table
            key={t.id}
            table={t}
            onSelectPage={onSelectPage}
            serviceFunction={() => serveTable(t)}
          />
        ))}
      </div>

      <div className="orders-column">
        <h2>Servies / En attente</h2>
        {served.map((t) => (
          <Table key={t.id} table={t} onSelectPage={onSelectPage} />
        ))}
      </div>
    </div>
  );
}
