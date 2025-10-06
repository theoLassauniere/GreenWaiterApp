export const Category = {
  STARTER: 'STARTER',
  MAIN: 'MAIN',
  DESSERT: 'DESSERT',
  BEVERAGE: 'BEVERAGE',
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export const fromString = (value: string): Category | undefined => {
  return Object.values(Category).includes(value as Category) ? (value as Category) : undefined;
};

export default Category;
