import { CommandState } from './CommandState.ts';
import { PreparationPlace } from './PreparationPlace.ts';

export interface TableType {
  readonly id: string;
  readonly groupNumber?: number;
  readonly tableNumber: number;
  readonly capacity: number;
  readonly occupied: boolean;
  readonly commandState?: CommandState;
  readonly commandId?: string;
  readonly commandPreparationPlace?: PreparationPlace;
}
