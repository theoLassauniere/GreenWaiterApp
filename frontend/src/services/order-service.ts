import config from '../config.ts';

const baseUrl = config.bffFlag ? config.bffApi.replace(/\/$/, '/kitchen') : '/api/kitchen';

// Teacher's implementation (web-services)
export type PreparationDto = {
  tableNumber: number;
  itemsToBeCooked: MenuItemShortDto[];
};

export type MenuItemShortDto = {
  menuItemShortName: string;
  howMany: number;
};

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

export const OrderService = {
  async createNewOrder(preparation: PreparationDto): Promise<OrderDto> {
    const payload = {
      tableNumber: preparation.tableNumber,
      itemsToBeCooked: preparation.itemsToBeCooked.map((item) => ({
        menuItemShortName: item.menuItemShortName,
        howMany: item.howMany,
      })),
    };
    const response = await fetch(`${baseUrl}/preparations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Erreur création commande: ${response.statusText}`);
    return response.json();
  },

  async getReadyOrders(): Promise<OrderDto[]> {
    const response = await fetch(`${baseUrl}/preparations?state=readyToBeServed`, {
      method: 'GET',
    });
    if (!response.ok)
      throw new Error(`Erreur récupération commandes prêtes: ${response.statusText}`);
    return response.json();
  },

  /*
    async addItemToOrder(orderId: number, itemId: number, quantity: number): Promise<OrderDto> {
        const response = await fetch(`${baseUrl}/dining/orders/${orderId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ itemId, quantity }),
        });
        if (!response.ok) throw new Error(`Erreur d'ajout d'item à la commande: ${response.statusText}`);
        return response.json();
    },
     */
};
