import type { Item } from '../models/Item';

export const mockMenuItems: Item[] = [
  {
    id: 1,
    name: 'Coca Cola 33cl',
    description: 'Boisson pétillante rafraîchissante',
    price: 3.0,
    imageUrl: 'src/assets/coca-33cl.jpg',
    allergens: [],
    categoryId: 1,
  },
  {
    id: 2,
    name: 'Pizza Margherita',
    description: 'Tomate, mozzarella, basilic',
    price: 9.5,
    imageUrl: 'src/assets/pizza-margherita.jpg',
    allergens: ['gluten', 'lactose'],
    categoryId: 3,
  },
  {
    id: 3,
    name: 'Cheesecake',
    description: 'Dessert crémeux au fromage frais',
    price: 5.5,
    imageUrl: 'src/assets/cheesecake.jpg',
    allergens: ['lactose', 'gluten'],
    categoryId: 4,
  },
];
