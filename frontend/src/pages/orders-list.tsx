import './orders-list.scss';
import { Table } from '../components/tables/table/table.tsx';
import type { TableType } from '../models/Table.ts';
import type { PageType } from '../models/Pages.ts';
import { type OrderDto, OrderService } from '../services/order-service.ts';
import { useEffect, useState } from 'react';

type OrdersListProps = {
  readonly tables: TableType[];
  readonly onSelectPage: (page: PageType, tableNumber?: number) => void;
};

export default function OrdersList(props: Readonly<OrdersListProps>) {
  const preparation = props.tables.filter((t) => t.commandState === 'preparing-in-kitchen');
  const served = props.tables.filter((t) => t.commandState === 'served');

  const [readyOrders, setReadyOrders] = useState<OrderDto[]>([]);

  useEffect(() => {
    OrderService.getReadyOrders().then(setReadyOrders);
  }, []);

  return (
    <div className="orders-list">
      <div className="orders-column">
        <h2>Préparation</h2>
        {preparation.map((t) => (
          <Table key={t.id} table={t} onSelectPage={props.onSelectPage} />
        ))}
      </div>

      <div className="orders-column">
        <h2>À servir</h2>
        {readyOrders.map((o) => {
          const table = props.tables.find((t) => t.tableNumber === o.tableNumber);
          if (!table) return null;
          return <Table key={table.id} table={table} onSelectPage={props.onSelectPage} />;
        })}
      </div>

      <div className="orders-column">
        <h2>Servies / En attente</h2>
        {served.map((t) => (
          <Table key={t.id} table={t} onSelectPage={props.onSelectPage} />
        ))}
      </div>
    </div>
  );
}
