import type Category from './Category.ts';

export interface Item {
  id: string;
  name: string;
  shortName: string;
  price: number;
  imageUrl?: string;
  allergens?: string[];
  category?: Category;
}
