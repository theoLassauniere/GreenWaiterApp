export const Category = {
  STARTER: 'STARTER',
  MAIN: 'MAIN',
  DESSERT: 'DESSERT',
  BEVERAGE: 'BEVERAGE',
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export default Category;
