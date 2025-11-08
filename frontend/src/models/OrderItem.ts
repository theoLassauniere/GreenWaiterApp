import type { Item } from './Item.ts';

export interface OrderItem extends Item {
  quantity: number;
  divider?: number;
}
