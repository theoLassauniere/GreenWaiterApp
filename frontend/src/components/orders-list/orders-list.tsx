import './orders-list.scss';
import Table, { type TableProps } from '../table/table';

type OrdersListProps = {
  readonly tables: readonly TableProps[];
};

export default function OrdersList({ tables }: Readonly<OrdersListProps>) {
  const preparation = tables.filter((t) => t.commandState === 'preparing-in-kitchen');
  const awaitingService = tables.filter((t) => t.commandState === 'awaiting-service');
  const served = tables.filter((t) => t.commandState === 'served');

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
        {awaitingService.map((t) => (
          <Table key={t.id} {...t} isCommandesPage={true} />
        ))}
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
