import config from '../config.ts';

const baseUrl = config.bffFlag ? config.bffApi.replace(/\/$/, '/dining') : '/api/dining';

export type MenuItemToOrderDto = {
  menuItemId: string;
  menuItemShortName: string;
  howMany: number;
};

export type ShortOrderDto = {
  tableNumber: number;
  menuItems: MenuItemToOrderDto[];
};

export type SimplifiedOrder = {
  _id: string;
  tableNumber: number;
};

export type PreparationDto = {
  _id: string;
  menuItemShortName: string;
  tableNumber: number;
  status: string;
};

export const OrderService = {
  // Retrieves the order ID for a given table number (web services version)
  async findOrderForTableNoBFF(tableNumber: number): Promise<string> {
    const response = await fetch(`${baseUrl}/tableOrders`, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Erreur récupération commandes prêtes: ${response.statusText}`);
    }
    const orders: SimplifiedOrder[] = await response.json();
    const order = orders.find((o) => o.tableNumber === tableNumber);
    if (!order) {
      throw new Error(`Aucune commande ouverte pour la table ${tableNumber}`);
    }
    return order._id;
  },

  async createNewOrderNoBFF(order: ShortOrderDto): Promise<PreparationDto[]> {
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
      if (!response.ok) throw new Error(`Erreur ajout item à une commande: ${response.statusText}`);
    }

    // Lance la préparation des items envoyés dans la commande précédente
    const prepareResponse = await fetch(`${baseUrl}/tableOrders/${tableOrderId}/prepare`, {
      method: 'POST',
    });
    if (!prepareResponse.ok) throw new Error(`Erreur préparation: ${prepareResponse.statusText}`);

    const preparations: PreparationDto[] = await prepareResponse.json();
    console.log(`Order created successfully for table ${order.tableNumber}`);
    return preparations;
  },

  async createNewOrderBFF(order: ShortOrderDto): Promise<PreparationDto[]> {
    const payload = {
      tableNumber: order.tableNumber,
      menuItems: order.menuItems,
    };
    const response = await fetch(`${baseUrl}/tableOrders/newOrder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erreur création commande: ${response.statusText}`);
    }

    const orderData = await response.json();
    console.log('Order created successfully for table ' + order.tableNumber);
    return orderData.preparations ?? [];
  },
};
