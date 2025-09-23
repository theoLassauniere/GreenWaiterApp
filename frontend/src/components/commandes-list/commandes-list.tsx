import './commandes-list.css';
import Table, { type TableProps } from '../table/table';

type CommandesListProps = {
  readonly tables: readonly TableProps[];
};

export default function CommandesList({ tables }: Readonly<CommandesListProps>) {
  const preparation = tables.filter((t) => t.commandState === 'preparing-in-kitchen');
  const awaitingService = tables.filter((t) => t.commandState === 'awaiting-service');
  const served = tables.filter((t) => t.commandState === 'served');

  return (
    <div className="commandes-list">
      <div className="commandes-column">
        <h2>Préparation</h2>
        {preparation.map((t) => (
          <Table key={t.id} {...t} isCommandesPage={true} />
        ))}
      </div>

      <div className="commandes-column">
        <h2>À servir</h2>
        {awaitingService.map((t) => (
          <Table key={t.id} {...t} isCommandesPage={true} />
        ))}
      </div>

      <div className="commandes-column">
        <h2>Servies / En attente</h2>
        {served.map((t) => (
          <Table key={t.id} {...t} isCommandesPage={true} />
        ))}
      </div>
    </div>
  );
}
