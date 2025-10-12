import config from '../config.ts';

const baseUrl = config.bffFlag ? config.bffApi.replace(/\/$/, '/dining') : '/api/dining';

const MAX_TIMEOUT = 2_147_483_647;

function scheduleAt(targetMs: number, cb: () => void): number {
  const diff = targetMs - Date.now();
  if (diff <= 0) {
    cb();
    return -1;
  }
  const delay = Math.min(diff, MAX_TIMEOUT);
  const id = window.setTimeout(() => {
    // S'il reste encore du temps (delai initial > MAX_TIMEOUT), on rechaîne
    if (targetMs - Date.now() > 0) {
      scheduleAt(targetMs, cb);
    } else {
      cb();
    }
  }, delay);
  return id;
}

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
  // Récupère l'ID de commande pour une table (sans BFF)
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

  async createNewOrder(order: ShortOrderDto): Promise<PreparationDto[]> {
    return config.bffFlag
      ? OrderService.createNewOrderBFF(order)
      : OrderService.createNewOrderNoBFF(order);
  },

  async createNewOrderNoBFF(order: ShortOrderDto): Promise<PreparationDto[]> {
    const tableOrderId = await OrderService.findOrderForTableNoBFF(order.tableNumber);

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
      if (!response.ok) {
        throw new Error(`Erreur ajout item à une commande: ${response.statusText}`);
      }
    }

    // Lance la préparation des items envoyés
    const prepareResponse = await fetch(`${baseUrl}/tableOrders/${tableOrderId}/prepare`, {
      method: 'POST',
    });
    if (!prepareResponse.ok) {
      throw new Error(`Erreur préparation: ${prepareResponse.statusText}`);
    }

    const preparations: PreparationDto[] = await prepareResponse.json();

    // Démarre chaque préparation côté cuisine (en parallèle, sans bloquer le retour)
    await OrderService.kitchenStartPrep(preparations);

    console.log(`Order created successfully for table ${order.tableNumber}`);
    return preparations;
  },

  async kitchenStartPrep(preparations: PreparationDto[]): Promise<void> {
    await Promise.allSettled(preparations.map((prep) => OrderService.startPreparation(prep)));
  },

  async startPreparation(preparation: PreparationDto): Promise<PreparationDto> {
    const response = await fetch(`${config.apiUrl}kitchen/preparedItems/${preparation._id}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Erreur démarrage préparation: ${response.statusText}`);
    }
    this.notifyAt(preparation, res.meanCookingTimeInSec);
    return await response.json();
  },

  async notifyAt(preparation: PreparationDto, triggerAtMs: number): Promise<void> {
    scheduleAt(triggerAtMs, () => {
      void OrderService.finishPrep(preparation);
    });
  },

  async finishPrep(preparation: PreparationDto): Promise<PreparationDto> {
    const response = await fetch(
      `${config.apiUrl}/kitchen/preparedItems/${preparation._id}/fininsh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!response.ok) {
      throw new Error(`Erreur service préparation: ${response.statusText}`);
    }

    window.dispatchEvent(
      new CustomEvent('order:notify', {
        detail: {
          preparation,
          message: `Préparation prête pour la table ${preparation.tableNumber}: ${preparation.menuItemShortName}`,
        },
      })
    );
    return await response.json();
  },

  async serveToTable(id: string): Promise<PreparationDto> {
    const response = await fetch(`${config.apiUrl}/kitchen/preparedItems/${id}/serveToTable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Erreur service préparation: ${response.statusText}`);
    }

    window.dispatchEvent(
      new CustomEvent('order:notify', {
        detail: {
          message: `Préparation prête pour la table ${response.tableNumber}`,
        },
      })
    );
    return await response.json();
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
    return orderData ?? [];
  },
};
