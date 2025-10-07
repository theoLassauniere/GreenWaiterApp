import './table.scss';
import config from '../../../config.ts';
import { OrderService, type ShortOrderDto } from '../../../services/order-service.ts';
import { Pages, type PageType } from '../../../models/Pages.ts';
import type { TableType } from '../../../models/Table.ts';
import { TableService } from '../../../services/table-service.ts';
import { useState } from 'react';

function openOrderPopup(tableNumber: number): void {
  // TODO: rediriger vers la page de création de commande
  const preparation: ShortOrderDto = {
    tableNumber: tableNumber,
    menuItems: [
      { menuItemId: '68da3b2fdf0da1d568180535', menuItemShortName: 'foie gras', howMany: 2 },
      { menuItemId: '68da3b2fdf0da1d568180538', menuItemShortName: 'soft-boiled egg', howMany: 3 },
    ],
  };

  const response = config.bffFlag
    ? OrderService.createNewOrderBFF(preparation).then(() => {})
    : OrderService.createNewOrderNoBFF(preparation).then(() => {});
  console.log(response);
}

export type TableProps = {
  readonly table: TableType;
  readonly onSelectPage: (page: PageType, tableNumber: number) => void;
};

export function Table({ table, onSelectPage }: Readonly<TableProps>) {
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
          <button onClick={() => openOrderPopup(localTable.tableNumber)}>Nouvelle commande</button>
        )}
        {localTable.commandState === 'awaiting-service' && <button>Servi</button>}
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
