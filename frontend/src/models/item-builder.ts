import type { Item } from './Item';
import type { Category } from './Category.ts';
import { fromString } from './Category.ts';

type RawItem = {
  id?: string | number;
  _id?: string | number;
  name?: unknown;
  fullName?: unknown;
  shortName?: unknown;
  price?: unknown;
  imageUrl?: unknown;
  image?: unknown;
  allergens?: unknown;
  category?: unknown;
};

export class ItemBuilder {
  private _id: string = '';
  private _name: string = '';
  private _shortName?: string;
  private _price: number = 0;
  private _imageUrl?: string;
  private _allergens?: string[];
  private _category?: Category;

  static fromJson(raw: unknown): Item {
    if (typeof raw !== 'object' || raw === null) {
      throw new Error('JSON invalide');
    }
    const r = raw as RawItem;

    const idVal = r.id ?? r._id ?? '';
    const shortNameVal = typeof r.shortName === 'string' ? r.shortName : undefined;

    // Le name principal privilégie fullName puis name puis shortName
    const nameVal =
      typeof r.fullName === 'string'
        ? r.fullName
        : typeof r.name === 'string'
          ? r.name
          : typeof r.shortName === 'string'
            ? r.shortName
            : String(r.name ?? '');

    const imageUrlVal =
      typeof r.imageUrl === 'string'
        ? r.imageUrl
        : typeof r.image === 'string'
          ? r.image
          : undefined;

    const category =
      typeof r.category === 'string' && r.category.trim() !== ''
        ? fromString(r.category)
        : undefined;

    const allergens = Array.isArray(r.allergens)
      ? (r.allergens.filter((a) => typeof a === 'string') as string[])
      : undefined;

    return new ItemBuilder()
      .id(idVal ?? '')
      .name(nameVal)
      .shortName(shortNameVal)
      .price(typeof r.price === 'number' ? r.price : Number(r.price ?? 0))
      .imageUrl(imageUrlVal)
      .allergens(allergens)
      .category(category)
      .build();
  }

  id(v: string | number) {
    this._id = String(v);
    return this;
  }
  name(v: string) {
    this._name = v;
    return this;
  }
  shortName(v?: string) {
    this._shortName = v;
    return this;
  }
  price(v: number) {
    this._price = v;
    return this;
  }
  imageUrl(v?: string) {
    this._imageUrl = v;
    return this;
  }
  allergens(v?: string[]) {
    this._allergens = v;
    return this;
  }
  category(v: Category | undefined) {
    this._category = v;
    return this;
  }

  build(): Item {
    return {
      id: this._id,
      name: this._name,
      shortName: this._shortName,
      price: this._price,
      imageUrl: this._imageUrl,
      allergens: this._allergens,
      category: this._category,
    } as Item;
  }
}
