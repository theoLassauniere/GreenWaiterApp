import type { CommandItem } from '../models/CommandItem.ts';
import Category from '../models/Category.ts';

export const mockCommandItems: CommandItem[] = [
  {
    id: '1',
    name: 'Coca Cola',
    quantity: 3,
    category: Category.BEVERAGE,
    price: 3,
  },
  {
    id: '2',
    name: 'Pastaga',
    quantity: 1,
    category: Category.BEVERAGE,
    price: 3,
  },
  {
    id: '3',
    name: 'Pizza Margherita',
    quantity: 2,
    category: Category.MAIN,
    price: 9.5,
  },
  {
    id: '4',
    name: 'Cheesecake',
    quantity: 1,
    category: Category.DESSERT,
    price: 5.5,
  },
  {
    id: '5',
    name: 'Cheesecake',
    quantity: 1,
    category: Category.DESSERT,
    price: 5.5,
  },
  {
    id: '6',
    name: 'Cheesecake',
    quantity: 1,
    category: Category.DESSERT,
    price: 5.5,
  },
  {
    id: '7',
    name: 'Cheesecake',
    quantity: 1,
    category: Category.DESSERT,
    price: 5.5,
  },
  {
    id: '8',
    name: 'Cheesecake',
    quantity: 1,
    category: Category.DESSERT,
    price: 5.5,
  },
  {
    id: '9',
    name: 'Cheesecake',
    quantity: 1,
    category: Category.DESSERT,
    price: 5.5,
  },
];
