export const Category = {
  BEVERAGE: 'BEVERAGE',
  STARTER: 'STARTER',
  MAIN: 'MAIN',
  DESSERT: 'DESSERT',
  MENU: 'MENU',
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export function getCategoryTitle(category: Category): string {
  const categoryTitles = {
    [Category.BEVERAGE]: 'Boissons',
    [Category.STARTER]: 'Entrées',
    [Category.MAIN]: 'Plats',
    [Category.DESSERT]: 'Desserts',
    [Category.MENU]: 'Menus',
  };
  return categoryTitles[category];
}

export const fromString = (value: string): Category | undefined => {
  return Object.values(Category).includes(value as Category) ? (value as Category) : undefined;
};

export default Category;
