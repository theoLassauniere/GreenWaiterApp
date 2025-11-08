import type Category from './Category.ts';
import type { Item } from './Item.ts';

export interface GroupMenu {
  name: string;
  price: number;
  itemsByCategory: Record<Category, Item[]>;
}
