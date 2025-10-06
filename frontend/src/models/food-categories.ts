import category from './Category.ts';

export const mockFoodCategories = [
  {
    title: 'Boissons',
    category: category.BEVERAGE,
    imageUrl: 'https://cdn.pixabay.com/photo/2018/10/23/19/39/water-3768773_960_720.jpg',
  },
  {
    title: 'Entrées',
    category: category.STARTER,
    imageUrl: 'https://cdn.pixabay.com/photo/2019/06/03/22/06/eggs-4250077_960_720.jpg',
  },
  {
    title: 'Plats',
    category: category.MAIN,
    imageUrl: 'https://cdn.pixabay.com/photo/2020/02/27/20/13/cake-4885715_1280.jpg',
  },
  {
    id: 4,
    title: 'Desserts',
    category: category.DESSERT,
    imageUrl: 'https://cdn.pixabay.com/photo/2017/03/19/18/22/italian-food-2157246_960_720.jpg',
  },
];
