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
      const dto = { tableNumber: table.tableNumber, customersCount: table.capacity };
      await TableService.openTableForOrders(dto);
      onUpdateTable?.(table.tableNumber, { occupied: true });
    } catch (err) {
      console.error('Erreur ouverture table :', err);
    }
  }

  return (
    <div
      className={`table-card ${table.occupied ? 'occupied' : 'free'}`}
      onClick={handleTableClick}
      style={{ cursor: !table.occupied ? 'pointer' : 'default' }}
    >
      <h3>Table {table.tableNumber}</h3>
      <p>
        Capacité :<strong> {table.capacity}</strong>
      </p>
      <p>
        <strong>{table.occupied ? 'Occupé' : 'Libre'}</strong>
      </p>

      <div className="command-actions">
        {table.occupied && (
          <button onClick={() => onSelectPage(Pages.Menu, table.tableNumber)}>
            Nouvelle commande
          </button>
        )}
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
