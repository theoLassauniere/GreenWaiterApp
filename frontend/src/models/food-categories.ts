import category from './Category.ts';

export const mockFoodCategories = [
  {
    title: 'Boissons',
    category: category.BEVERAGE,
    imageUrl: 'https://picsum.photos/400/300?random=1',
  },
  {
    title: 'Entrées',
    category: category.STARTER,
    imageUrl: 'https://picsum.photos/400/300?random=2',
  },
  {
    title: 'Plats',
    category: category.MAIN,
    imageUrl: 'https://picsum.photos/400/300?random=3',
  },
  {
    id: 4,
    title: 'Desserts',
    category: category.DESSERT,
    imageUrl: 'https://picsum.photos/400/300?random=4',
  },
];
