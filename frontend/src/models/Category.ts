export const Category = {
  STARTER: 'STARTER',
  MAIN: 'MAIN',
  DESSERT: 'DESSERT',
  BEVERAGE: 'BEVERAGE',
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export function getCategoryTitle(category: Category): string {
  const categoryTitles = {
    [Category.STARTER]: 'Entrées',
    [Category.MAIN]: 'Plats',
    [Category.DESSERT]: 'Desserts',
    [Category.BEVERAGE]: 'Boissons',
  };
  return categoryTitles[category];
}

export const fromString = (value: string): Category | undefined => {
  return Object.values(Category).includes(value as Category) ? (value as Category) : undefined;
};

export default Category;
