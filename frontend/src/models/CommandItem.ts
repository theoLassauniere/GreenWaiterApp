import type { Item } from './Item.ts';

export interface CommandItem extends Item {
  quantity: number;
  divider?: number;
}
