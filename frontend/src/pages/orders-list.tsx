import './orders-list.scss';
import { Table } from '../components/tables/table/table.tsx';
import type { TableType } from '../models/Table.ts';
import type { PageType } from '../models/Pages.ts';
import { useEffect } from 'react';
import { OrderService } from '../services/order-service.ts';

type OrdersListProps = {
  readonly tables: TableType[];
  readonly onSelectPage: (page: PageType, tableNumber?: number) => void;
};

export default function OrdersList(props: Readonly<OrdersListProps>) {
  const preparation = props.tables.filter((t) => t.commandState === 'preparing-in-kitchen');
  const awaitingService = props.tables.filter((t) => t.commandState === 'awaiting-service');
  const served = props.tables.filter((t) => t.commandState === 'served');

  const serveTable = async (table: TableType) => {
    if (!table.commandId) {
      console.error('No commandId for table', table);
      return;
    }
    try {
      await OrderService.serveToTable(table.commandId);
      // NOTE: ne pas muter directement `table`; laisser le parent rafraîchir l’état
    } catch (err) {
      console.error('Error serving table', err);
    }
  };

  useEffect(() => {
    // TODO : use the kitchen service to retrieve ready orders
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
        {awaitingService.map((t) => (
          <Table
            key={t.id}
            table={t}
            onSelectPage={props.onSelectPage}
            serviceFunction={() => serveTable(t)}
          />
        ))}
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
