import { TableService } from './table-service.ts';
import type { CommandItem } from '../models/CommandItem.ts';
import { MenuService } from './menu-service.ts';
import type Category from '../models/Category.ts';
import config from '../config.ts';

const baseUrl = config.bffFlag ? config.bffApi.replace(/\/$/, '') : '/api';

export const PaymentService = {
  async getCommandItems(tableNumber: number): Promise<CommandItem[]> {
    if (config.bffFlag) {
      return getCommandItemsFromBff(tableNumber);
    } else {
      return getCommandItemsFromBack(tableNumber);
    }
  },
};

async function getCommandItemsFromBff(tableNumber: number): Promise<CommandItem[]> {
  const url = `${baseUrl}/dining/tableOrders/items/${tableNumber}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Erreur de récupération de la commande pour la table ${tableNumber}: ${response.statusText}`
    );
  }
  return await response.json();
}

async function getCommandItemsFromBack(tableNumber: number): Promise<CommandItem[]> {
  const orders = await TableService.getTableOrdersFromBack(tableNumber);
  const allLines = orders.flatMap((order) => order.lines);

  return Promise.all(
    allLines.map(async (orderLine) => {
      const itemInfo = await MenuService.getMenuItemFromBack(orderLine.item._id);
      return {
        id: orderLine.item._id,
        name: itemInfo.fullName,
        shortName: orderLine.item.shortName,
        price: itemInfo.price,
        imageUrl: itemInfo.image,
        category: itemInfo.category as Category,
        quantity: orderLine.howMany,
      };
    })
  );
}
