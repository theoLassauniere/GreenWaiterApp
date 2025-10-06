import { type RawOrder, TableService } from './table-service.ts';
import type { CommandItem } from '../models/CommandItem.ts';
import { MenuService } from './menu-service.ts';
import type Category from '../models/Category.ts';

export const PaymentService = {
  async getCommandItems(tableNumber: number): Promise<CommandItem[]> {
    const tableOrders: RawOrder[] = await TableService.getTableOrders();
    const order = tableOrders.find((table) => table.tableNumber === tableNumber);
    if (!order || !order.lines) {
      return [];
    }

    return Promise.all(
      order.lines.map(async (orderLine) => {
        const itemInfo = await MenuService.getMenuItem(orderLine.item._id);
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
  },
};
