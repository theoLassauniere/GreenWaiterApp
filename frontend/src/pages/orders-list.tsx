import './orders-list.scss';
import { Table } from '../components/tables/table/table.tsx';
import type { TableType } from '../models/Table.ts';
import type { PageType } from '../models/Pages.ts';
import { useEffect } from 'react';
import { OrderState } from '../models/OrderState.ts';

type OrdersListProps = {
  readonly tables: TableType[];
  readonly onSelectPage: (page: PageType, tableNumber?: number) => void;
  readonly refreshTables?: () => void;
  readonly handleUpdateTable: (tableNumber: number, updates: Partial<TableType>) => void;
};

export function OrdersList({ tables, onSelectPage, handleUpdateTable }: Readonly<OrdersListProps>) {
  const preparation = tables.filter((t) => t.orderState === OrderState.PreparingInKitchen);
  const awaitingService = tables.filter((t) => t.orderState === OrderState.AwaitingService);
  const served = tables.filter((t) => t.orderState === OrderState.Served);

  useEffect(() => {
    const handleOrderUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      console.log('Notification reçue:', detail.message);
    };

    globalThis.addEventListener('order:notify', handleOrderUpdate);
    return () => globalThis.removeEventListener('order:notify', handleOrderUpdate);
  }, []);

  return (
    <div className="orders-list">
      <div className="orders-column">
        <h2>Préparation</h2>
        {preparation.map((t) => (
          <Table
            key={t.id}
            table={t}
            onSelectPage={onSelectPage}
            onUpdateTable={handleUpdateTable}
          />
        ))}
      </div>

      <div className="orders-column">
        <h2>À servir</h2>
        {awaitingService.map((t) => (
          <Table
            key={t.id}
            table={t}
            onSelectPage={onSelectPage}
            onUpdateTable={handleUpdateTable}
          />
        ))}
      </div>

      <div className="orders-column">
        <h2>Servies / En attente</h2>
        {served.map((t) => (
          <Table
            key={t.id}
            table={t}
            onSelectPage={onSelectPage}
            onUpdateTable={handleUpdateTable}
          />
        ))}
      </div>
    </div>
  );
}
