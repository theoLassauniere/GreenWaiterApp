import './table.scss';
import { OrderService, type PreparationDto } from '../../../services/order-service.tsx';
import { Pages, type PageType } from '../../../models/Pages.ts';
import type { TableType } from '../../../models/Table.ts';

function openOrderPopup(tableNumber: number) {
  // TODO: rediriger vers la page de création de commande
  // Mock pour l'instant, à refaire dans la page de création de commande
  const preparation: PreparationDto = {
    tableNumber: tableNumber,
    itemsToBeCooked: [
      { menuItemShortName: 'lasagna', howMany: 2 },
      { menuItemShortName: 'beef burger', howMany: 1 },
    ],
  };
  OrderService.createNewOrder(preparation).then((r) => console.log(r));
}

export type TableProps = {
  readonly table: TableType;
  readonly isCommandesPage: boolean; // L'affichage du composant table n'est pas le même selon la page "Commandes" ou la page "Tables" d'où ce flag
  readonly onSelectPage: (page: PageType, tableNumber: number) => void;
};

export function Table(props: Readonly<TableProps>) {
  return (
    <div className={`table-card ${props.table.occupied ? 'occupied' : 'free'}`}>
      <h3>Table {props.table.tableNumber}</h3>
      <p>
        Capacité :<strong> {props.table.capacity}</strong>
      </p>
      <p>
        <strong>{props.table.occupied ? 'Occupé' : 'Libre'}</strong>
      </p>

      <div className="command-actions">
        <button onClick={() => openOrderPopup(props.table.tableNumber)}>Nouvelle commande</button>

        {props.table.commandState === 'awaiting-service' && <button>Servi</button>}
      </div>

      {props.table.commandState === 'served' && (
        <button
          onClick={() => props.onSelectPage(Pages.Paiement, props.table.tableNumber)}
          className="pay-btn"
        >
          Paiement
        </button>
      )}

      {props.table.commandPreparationPlace && (
        <p>
          Commande pour :{' '}
          <strong>{props.table.commandPreparationPlace === 'bar' ? 'Bar' : 'Cuisine'}</strong>
        </p>
      )}
    </div>
  );
}
