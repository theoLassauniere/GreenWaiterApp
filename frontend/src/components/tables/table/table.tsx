import './table.scss';
import type { TableType } from '../../../models/Table.ts';
import type { PageType } from '../../../models/Pages.ts';
import { Pages } from '../../../models/Pages.ts';
import { TableService } from '../../../services/table-service.ts';
import { useState } from 'react';

export type TableProps = {
  readonly table: TableType;
  readonly onSelectPage: (page: PageType, tableNumber: number) => void;
  serviceFunction?: () => void;
};

export function Table({ table, onSelectPage, serviceFunction }: Readonly<TableProps>) {
  const [localTable, setLocalTable] = useState(table);
  async function handleTableClick() {
    if (localTable.occupied) return;

    try {
      const dto = { tableNumber: localTable.tableNumber, customersCount: localTable.capacity };
      await TableService.openTableForOrders(dto);
      setLocalTable({ ...localTable, occupied: true });
    } catch (err) {
      console.error('Erreur ouverture table :', err);
    }
  }

  return (
    <div
      className={`table-card ${localTable.occupied ? 'occupied' : 'free'}`}
      onClick={handleTableClick}
      style={{ cursor: !localTable.occupied ? 'pointer' : 'default' }}
    >
      <h3>Table {localTable.tableNumber}</h3>
      <p>
        Capacité :<strong> {localTable.capacity}</strong>
      </p>
      <p>
        <strong>{localTable.occupied ? 'Occupé' : 'Libre'}</strong>
      </p>

      <div className="command-actions">
        {localTable.occupied && (
          <button onClick={() => onSelectPage(Pages.Menu, localTable.tableNumber)}>
            Nouvelle commande
          </button>
        )}
        {localTable.commandState === 'awaiting-service' && (
          <button onClick={serviceFunction}>Servi</button>
        )}
      </div>

      {localTable.commandState === 'served' && (
        <button
          onClick={() => onSelectPage(Pages.Paiement, localTable.tableNumber)}
          className="pay-btn"
        >
          Paiement
        </button>
      )}

      {localTable.commandPreparationPlace && (
        <p>
          Commande pour :{' '}
          <strong>{localTable.commandPreparationPlace === 'bar' ? 'Bar' : 'Cuisine'}</strong>
        </p>
      )}
    </div>
  );
}
