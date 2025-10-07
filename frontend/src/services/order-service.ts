import config from '../config.ts';

const baseUrl = config.bffFlag ? config.bffApi.replace(/\/$/, '/dining') : '/api/dining';

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
  // Retrieves the order ID for a given table number (web services version)
  async findOrderForTableNoBFF(tableNumber: number): Promise<string> {
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
    const tableOrderId = await this.findOrderForTableNoBFF(order.tableNumber);
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
    console.log('Order created successfully for table ' + order.tableNumber);
  },

  async createNewOrderBFF(order: ShortOrderDto): Promise<void> {
    const payload = {
      tableNumber: order.tableNumber,
      menuItems: order.menuItems,
    };
    const response = await fetch(`${baseUrl}/tableOrders/newOrder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Erreur création commande: ${response.statusText}`);
    console.log('Order created successfully for table ' + order.tableNumber);
  },
};
