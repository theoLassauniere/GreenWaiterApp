export interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  allergens?: string[];
  categoryId: number;
}
