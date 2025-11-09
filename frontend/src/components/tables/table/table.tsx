import './table.scss';
import type { TableType } from '../../../models/Table.ts';
import type { PageType } from '../../../models/Pages.ts';
import { Pages } from '../../../models/Pages.ts';
import { TableService } from '../../../services/table-service.ts';
import { OrderService } from '../../../services/order-service.ts';

export type TableProps = {
  readonly table: TableType;
  readonly onSelectPage: (page: PageType, tableNumber: number) => void;
  onUpdateTable?: (tableNumber: number, updates: Partial<TableType>) => void;
};

export function Table({ table, onSelectPage, onUpdateTable }: Readonly<TableProps>) {
  async function handleTableClick() {
    if (table.occupied) return;

    try {
      if (!table.groupId) {
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
    if (table?.groupId) onSelectPage(Pages.MenuGroupe, table.tableNumber);
    else onSelectPage(Pages.Menu, table.tableNumber);
  }

  const className = table.groupId
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
      {table.groupId !== null && <div className="group-badge">G{table.groupId}</div>}
      <h3>Table {table.tableNumber}</h3>
      <p>Capacité : {table.capacity}</p>
      <p>{table.occupied ? 'Occupé' : 'Libre'}</p>

      <div className="command-actions">
        {table.occupied && (
          <button className="new-order" onClick={handleNewOrderClick}>
            Nouvelle commande
          </button>
        )}
        {table.orderState === 'awaiting-service' && (
          <button className="served-btn" onClick={async () => OrderService.serveTable(table)}>
            Servie
          </button>
        )}
      </div>

      {table.orderState === 'served' && (
        <button onClick={() => onSelectPage(Pages.Paiement, table.tableNumber)} className="pay-btn">
          Paiement
        </button>
      )}

      {table.orderPreparationPlace && (
        <p>Commande pour : {table.orderPreparationPlace === 'bar' ? 'Bar' : 'Cuisine'}</p>
      )}
    </div>
  );
}
