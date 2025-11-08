import type { PreparationPlace } from './PreparationPlace.ts';
import type { OrderState } from './OrderState.ts';

export interface TableType {
  readonly id: string;
  readonly groupNumber?: number;
  readonly tableNumber: number;
  readonly capacity: number;
  readonly occupied: boolean;
  readonly orderState?: OrderState;
  readonly orderId?: string;
  readonly orderPreparationPlace?: PreparationPlace;
}
