import './orders-list.scss';
import Table, { type TableProps } from '../components/tables/table/table.tsx';
import { type OrderDto, OrderService } from '../services/order-service.tsx';
import { useEffect, useState } from 'react';

type OrdersListProps = {
  readonly tables: readonly TableProps[];
};

export default function OrdersList({ tables }: Readonly<OrdersListProps>) {
  const preparation = tables.filter((t) => t.commandState === 'preparing-in-kitchen');
  const served = tables.filter((t) => t.commandState === 'served');

  const [readyOrders, setReadyOrders] = useState<OrderDto[]>([]);

  useEffect(() => {
    OrderService.getReadyOrders().then(setReadyOrders);
  }, []);

  return (
    <div className="orders-list">
      <div className="orders-column">
        <h2>Préparation</h2>
        {preparation.map((t) => (
          <Table key={t.id} {...t} isCommandesPage={true} />
        ))}
      </div>

      <div className="orders-column">
        <h2>À servir</h2>
        {readyOrders.map((o) => {
          const table = tables.find((t) => t.tableNumber === o.tableNumber);
          if (!table) return null;
          return <Table key={table.id} {...table} />;
        })}
      </div>

      <div className="orders-column">
        <h2>Servies / En attente</h2>
        {served.map((t) => (
          <Table key={t.id} {...t} isCommandesPage={true} />
        ))}
      </div>
    </div>
  );
}
