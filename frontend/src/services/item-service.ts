import config from '../config.ts';
import type { Category } from '../models/Category.ts';
import type { Item } from '../models/Item.ts';
import { ItemBuilder } from '../models/item-builder.ts';
import getAllergens from './service-allergen.ts';

const cacheMap = new Map<Category, Item[]>();

export async function getListItems(category: Category): Promise<Item[]> {
  if (cacheMap.has(category)) {
    return cacheMap.get(category)!;
  }
  const items = config.bffFlag
    ? await getListItemsBFF(category)
    : await getListItemsNoBFF(category);
  cacheMap.set(category, items);
  return items;
}

async function getListItemsBFF(category: Category): Promise<Item[]> {
  try {
    const res = await fetch(`${config.bffApi}/item/getItems/${category}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      console.error('Erreur HTTP menus', res.status);
      return [];
    }
    const payload = await res.json();
    return buildItemsArray(payload);
  } catch (e) {
    console.error('Erreur réseau menus', e);
    return [];
  }
}

async function getListItemsNoBFF(category: Category): Promise<Item[]> {
  try {
    const res = await fetch(`${config.apiUrl}menu/menus`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      console.error('Erreur HTTP menus', res.status);
      return [];
    }
    const payload = await res.json();
    const items = buildItemsArray(payload).filter((i) => !category || i.category === category);

    for (const item of items) {
      item.allergens = await getAllergens(item.id);
    }

    return items;
  } catch (e) {
    console.error('Erreur réseau menus', e);
    return [];
  }
}

function buildItemsArray(raw: unknown): Item[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((r) => {
    try {
      return ItemBuilder.fromJson(r);
    } catch {
      return [];
    }
  });
}
