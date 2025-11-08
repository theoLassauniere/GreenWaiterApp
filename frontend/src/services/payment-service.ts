import { TableService } from './table-service.ts';
import type { OrderItem } from '../models/OrderItem.ts';
import { MenuService } from './menu-service.ts';
import type Category from '../models/Category.ts';
import config from '../config.ts';

const baseUrl = config.bffFlag ? config.bffApi.replace(/\/$/, '') : '/api';

export const PaymentService = {
  async getOrderItems(tableNumber: number): Promise<OrderItem[]> {
    if (config.bffFlag) {
      return getOrderItemsFromBff(tableNumber);
    } else {
      return getOrderItemsFromBack(tableNumber);
    }
  },
};

async function getOrderItemsFromBff(tableNumber: number): Promise<OrderItem[]> {
  const url = `${baseUrl}/dining/tableOrders/items/${tableNumber}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Erreur de récupération de la commande pour la table ${tableNumber}: ${response.statusText}`
    );
  }
  return await response.json();
}

async function getOrderItemsFromBack(tableNumber: number): Promise<OrderItem[]> {
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
