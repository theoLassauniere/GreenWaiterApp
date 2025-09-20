import { CommandState } from "../models/CommandState";
import { PreparationPlace } from "../models/PreparationPlace";

export type TableProps = {
    readonly id: number;
    readonly capacity: number;
    readonly occupied: boolean;
    readonly hasBeenServed: boolean;
    readonly isCommandesPage?: boolean; // L'affichage du composant table n'est pas le même selon la page "Commandes" ou la page "Tables" d'où ce flag
    readonly commandState?: CommandState;
    readonly commandPreparationPlace?: PreparationPlace;
}
