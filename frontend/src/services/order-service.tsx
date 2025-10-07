import config from '../config.ts';

const baseUrl = config.bffFlag ? config.bffApi.replace(/\/$/, '/dining') : '/api/dining';

export type OrderDto = {
  id: number;
  tableNumber: number;
  shouldBeReadyAt: string;
  completedAt: string;
  takenForServiceAt: string;
  preparedItems: PreparedItemDto[];
};

export type PreparedItemDto = {
  id: number;
  shortName: string;
  shouldStartAt: string;
  startedAt: string;
  finishedAt: string;
};

export type ShortOrderDto = {
  tableNumber: number;
  menuItems: MenuItemToOrderDto[];
};

export type MenuItemToOrderDto = {
  menuItemId: string;
  menuItemShortName: string;
  howMany: number;
};

export type SimplifiedOrder = {
  _id: string;
  tableNumber: number;
};

export const OrderService = {
  // Retrieves the order ID for a given table number
  async findOrderForTable(tableNumber: number): Promise<string> {
    const response = await fetch(`${baseUrl}/tableOrders`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Erreur récupération commandes prêtes: ${response.statusText}`);
    }
    const orders: SimplifiedOrder[] = await response.json();
    return orders.filter((order) => order.tableNumber === tableNumber)[0]._id;
  },

  // Creates a new order. Each menu item in the order is sent as a separate POST request.
  async createNewOrderNoBFF(order: ShortOrderDto): Promise<void> {
    const tableOrderId = await this.findOrderForTable(order.tableNumber);
    for (const item of order.menuItems) {
      const payload = {
        menuItemId: item.menuItemId,
        menuItemShortName: item.menuItemShortName,
        howMany: item.howMany,
      };
      const response = await fetch(`${baseUrl}/tableOrders/${tableOrderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Erreur création commande: ${response.statusText}`);
    }
  },

  async createNewOrderBFF(order: ShortOrderDto): Promise<void> {
    // TODO : to implement
    console.log(order);
    return;
  },

  // Fetches all orders that are ready to be served
  // TODO : move this in the kitchen service
  /*
  async getReadyOrders(): Promise<OrderDto[]> {
    const response = await fetch(`${baseUrl}/preparations?state=readyToBeServed`, {
      method: 'GET',
    });
    if (!response.ok)
      throw new Error(`Erreur récupération commandes prêtes: ${response.statusText}`);
    return response.json();
  },
   */
};
