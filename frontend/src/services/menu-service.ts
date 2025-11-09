import config from '../config.ts';
import type { Category } from '../models/Category.ts';
import type { Item } from '../models/Item.ts';
import { ItemBuilder } from '../models/item-builder.ts';
import getAllergens from './service-allergen.ts';
import type { GroupMenu } from '../models/group-menu.ts';
import type { RawMenuItem } from '../models/RawMenuItem.ts';

const baseUrl = config.bffFlag ? `${config.bffApi}/menus` : `${config.apiUrl}menu/menus`;
const cacheMap = new Map<Category, Item[]>();

export const MenuService = {
  async getListItems(category: Category): Promise<Item[]> {
    if (cacheMap.has(category)) {
      return cacheMap.get(category)!;
    }
    const items = config.bffFlag
      ? await this.getListItemsBFF(category)
      : await this.getListItemsNoBFF(category);
    cacheMap.set(category, items);
    return items;
  },

  async hasExtrasForTable(tableNumber: number): Promise<boolean> {
    try {
      const orderRes = await fetch(`${config.bffApi}dining/tableOrders/items/${tableNumber}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!orderRes.ok) return false;

      const orderedItems: { id: string }[] = await orderRes.json();

      const menu = await this.getGroupMenu(tableNumber);
      if (!menu || !menu.itemsByCategory) return false;

      const menuItemIds = Object.values(menu.itemsByCategory)
        .flat()
        .map((item) => item.id);

      return orderedItems.some((item) => !menuItemIds.includes(item.id));
    } catch (err) {
      console.error('Erreur dans hasExtrasForTable:', err);
      return false;
    }
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

  async getGroupMenu(groupId: number | undefined): Promise<GroupMenu | undefined> {
    try {
      const res = await fetch(`${config.bffApi}item/getMenu/${groupId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        console.error('Erreur HTTP lors de la récupération du menu groupé', res.status);
        return undefined;
      }
      const payload = await res.json();

      const itemsByCategory: Record<Category, Item[]> = {} as Record<Category, Item[]>;
      if (payload && payload.itemsByCategory && typeof payload.itemsByCategory === 'object') {
        for (const category in payload.itemsByCategory) {
          if (Object.prototype.hasOwnProperty.call(payload.itemsByCategory, category)) {
            itemsByCategory[category as Category] = this.buildItemsArray(
              payload.itemsByCategory[category]
            );
          }
        }
      }

      return {
        maxMembers: payload.maxMembers,
        menuCount: payload.menuCount ?? 0,
        name: payload.name ?? '',
        price: payload.price ?? 0,
        itemsByCategory,
      };
    } catch (e) {
      console.error(
        'Erreur réseau lors de la récupération du menu groupé ',
        e,
        'sur la table ',
        groupId
      );
      return undefined;
    }
  },

  async getListItemsBFF(category: Category): Promise<Item[]> {
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
      return this.buildItemsArray(payload);
    } catch (e) {
      console.error('Erreur réseau menus', e);
      return [];
    }
  },

  async getListItemsNoBFF(category: Category): Promise<Item[]> {
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
      const items = this.buildItemsArray(payload).filter(
        (i: Item) => !category || i.category === category
      );

      for (const item of items) {
        item.allergens = getAllergens(item.shortName);
      }

      return items;
    } catch (e) {
      console.error('Erreur réseau menus', e);
      return [];
    }
  },

  buildItemsArray(raw: unknown): Item[] {
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((r) => {
      try {
        return ItemBuilder.fromJson(r);
      } catch {
        return [];
      }
    });
  },
};
