import './table.scss';
import type { TableType } from '../../../models/Table.ts';
import type { PageType } from '../../../models/Pages.ts';
import { Pages } from '../../../models/Pages.ts';
import { TableService } from '../../../services/table-service.ts';

export type TableProps = {
  readonly table: TableType;
  readonly onSelectPage: (page: PageType, tableNumber: number) => void;
  serviceFunction?: () => void;
  onUpdateTable?: (tableNumber: number, updates: Partial<TableType>) => void;
};

export function Table({
  table,
  onSelectPage,
  serviceFunction,
  onUpdateTable,
}: Readonly<TableProps>) {
  async function handleTableClick() {
    if (table.occupied) return;

    try {
      if (!table.groupNumber) {
        const dto = { tableNumber: table.tableNumber, customersCount: table.capacity };
        await TableService.openTableForOrders(dto);
        onUpdateTable?.(table.tableNumber, { occupied: true });
        return;
      }
      onUpdateTable?.(table.tableNumber, { occupied: true });
    } catch (err) {
      console.error('Erreur ouverture table :', err);
    }
  }

  function handleNewOrderClick() {
    if (table?.groupNumber) onSelectPage(Pages.MenuGroupe, table.tableNumber);
    else onSelectPage(Pages.Menu, table.tableNumber);
  }

  const className = table.groupNumber
    ? table.occupied
      ? 'table-card group-occupied'
      : 'table-card group-free'
    : table.occupied
      ? 'table-card occupied'
      : 'table-card free';

  return (
    <div
      className={className}
      onClick={handleTableClick}
      style={{ cursor: !table.occupied ? 'pointer' : 'default' }}
    >
      {table.groupNumber !== null && <h3>Groupe {table.groupNumber}</h3>}
      <h3>Table {table.tableNumber}</h3>
      <p>
        Capacité :<strong> {table.capacity}</strong>
      </p>
      <p>
        <strong>{table.occupied ? 'Occupé' : 'Libre'}</strong>
      </p>

      <div className="command-actions">
        {table.occupied && <button onClick={() => handleNewOrderClick()}>Nouvelle commande</button>}
        {table.commandState === 'awaiting-service' && (
          <button onClick={serviceFunction}>Servi</button>
        )}
      </div>

      {table.commandState === 'served' && (
        <button onClick={() => onSelectPage(Pages.Paiement, table.tableNumber)} className="pay-btn">
          Paiement
        </button>
      )}

      {table.commandPreparationPlace && (
        <p>
          Commande pour :{' '}
          <strong>{table.commandPreparationPlace === 'bar' ? 'Bar' : 'Cuisine'}</strong>
        </p>
      )}
    </div>
  );
}
