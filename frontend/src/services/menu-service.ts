import config from '../config.ts';
import type { Category } from '../models/Category.ts';
import type { Item } from '../models/Item.ts';
import { ItemBuilder } from '../models/item-builder.ts';
import getAllergens from './service-allergen.ts';
import type { GroupMenu } from '../models/GroupMenu.ts';
import type { RawMenuItem } from '../models/RawMenuItem.ts';

const baseUrl = config.bffFlag ? `${config.bffApi}/menus` : `${config.apiUrl}menu/menus`;
const cacheMap = new Map<Category, Item[]>();

export const MenuService = {
  async getListItems(category: Category): Promise<Item[]> {
    if (cacheMap.has(category)) {
      return cacheMap.get(category)!;
    }
    const items = config.bffFlag
      ? await getListItemsBFF(category)
      : await getListItemsNoBFF(category);
    cacheMap.set(category, items);
    return items;
  },

  async getMenuItemFromBack(id: string): Promise<RawMenuItem> {
    const url = `${baseUrl}/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération de l'élément d'id ${id} : ${response.statusText}`
      );
    }
    return response.json();
  },

  async getGroupMenu(): Promise<GroupMenu | null> {
    try {
      const res = await fetch(`${config.bffApi}item/getMenu`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        console.error('Erreur HTTP lors de la récupération du menu groupé', res.status);
        return null;
      }
      const payload = await res.json();

      const itemsByCategory: Record<string, Item[]> = {};
      if (payload && payload.itemsByCategory && typeof payload.itemsByCategory === 'object') {
        for (const category in payload.itemsByCategory) {
          if (Object.prototype.hasOwnProperty.call(payload.itemsByCategory, category)) {
            itemsByCategory[category] = buildItemsArray(payload.itemsByCategory[category]);
          }
        }
      }

      return {
        name: payload.name ?? '',
        price: payload.price ?? 0,
        itemsByCategory,
      };
    } catch (e) {
      console.error('Erreur réseau lors de la récupération du menu groupé', e);
      return null;
    }
  },
};

async function getListItemsBFF(category: Category): Promise<Item[]> {
  try {
    const res = await fetch(`${config.bffApi}item/getItems/${category}`, {
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
      item.allergens = getAllergens(item.shortName);
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
