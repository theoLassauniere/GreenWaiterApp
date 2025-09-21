export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  allergens?: string[];
}
