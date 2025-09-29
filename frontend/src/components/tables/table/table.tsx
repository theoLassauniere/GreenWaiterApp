import './table.scss';
import { CommandState } from '../../../models/CommandState.ts';
import { PreparationPlace } from '../../../models/PreparationPlace.ts';

export default function Table({
  tableNumber,
  capacity,
  occupied,
  isCommandesPage = false,
  commandState,
  commandPreparationPlace,
}: Readonly<TableProps>) {
  return (
    <div className={`table-card ${occupied ? 'occupied' : 'free'}`}>
      <h3>Table {tableNumber}</h3>
      <p>
        Capacité :<strong> {capacity}</strong>
      </p>
      <p>
        <strong>{occupied ? 'Occupé' : 'Libre'}</strong>
      </p>

      {isCommandesPage && (
        <div className="command-actions">
          <button>Nouvelle commande</button>

          {commandState === 'awaiting-service' && <button>Servi</button>}
        </div>
      )}

      {commandState === 'served' && <button className="pay-btn">Paiement</button>}

      {commandPreparationPlace && (
        <p>
          Commande pour : <strong>{commandPreparationPlace === 'bar' ? 'Bar' : 'Cuisine'}</strong>
        </p>
      )}
    </div>
  );
}

export type TableProps = {
  readonly id: string;
  readonly tableNumber: number;
  readonly capacity: number;
  readonly occupied: boolean;
  readonly isCommandesPage?: boolean; // L'affichage du composant table n'est pas le même selon la page "Commandes" ou la page "Tables" d'où ce flag
  readonly commandState?: CommandState;
  readonly commandPreparationPlace?: PreparationPlace;
};
