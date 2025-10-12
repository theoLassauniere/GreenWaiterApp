import config from '../config.ts';

// L'URL de base est correcte
const baseUrl = config.bffFlag ? config.bffApi.replace(/\/$/, '/dining') : '/api/dining';

// La gestion du timeout est correcte
const MAX_TIMEOUT = 2_147_483_647;

function scheduleAt(targetMs: number, cb: () => void): number {
  const diff = targetMs - Date.now();
  if (diff <= 0) {
    cb();
    return -1;
  }
  const delay = Math.min(diff, MAX_TIMEOUT);
  const id = window.setTimeout(() => {
    if (targetMs - Date.now() > 0) {
      scheduleAt(targetMs, cb);
    } else {
      cb();
    }
  }, delay);
  return id;
}

// --- Section des Types (DTOs) ---

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

export type PreparedItemDto = {
  _id: string;
  shortName: string;
  meanCookingTimeInSec?: number; // AMÉLIORATION : Ajouté pour plus de flexibilité
};

// AMÉLIORATION : J'ai fusionné PreparationDto et PreparationResponseDto
// en un seul type pour éviter la confusion et les erreurs de typage.
export type PreparationDto = {
  _id: string;
  menuItemShortName: string;
  tableNumber: number;
  status: string;
  shouldBeReadyAt?: string; // ISO 8601, ex.: "2025-10-12T09:29:38.594Z"
  preparedItems?: PreparedItemDto[];
};

// --- Service ---

export const OrderService = {
  // Fonction inchangée, elle était correcte
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

  // Fonction inchangée, elle était correcte
  async createNewOrder(order: ShortOrderDto): Promise<PreparationDto[]> {
    return config.bffFlag
      ? OrderService.createNewOrderBFF(order)
      : OrderService.createNewOrderNoBFF(order);
  },

  async createNewOrderNoBFF(order: ShortOrderDto): Promise<PreparationDto[]> {
    const tableOrderId = await OrderService.findOrderForTableNoBFF(order.tableNumber);

    // AMÉLIORATION : Envoi des items en parallèle pour plus de performance
    const addItemsPromises = order.menuItems.map((item) => {
      const payload = {
        menuItemId: item.menuItemId,
        menuItemShortName: item.menuItemShortName,
        howMany: item.howMany,
      };
      return fetch(`${baseUrl}/tableOrders/${tableOrderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    });
    const responses = await Promise.all(addItemsPromises);
    for (const response of responses) {
      if (!response.ok) {
        throw new Error(`Erreur ajout item à une commande: ${response.statusText}`);
      }
    }

    // Lance la préparation
    const prepareResponse = await fetch(`${baseUrl}/tableOrders/${tableOrderId}/prepare`, {
      method: 'POST',
    });
    if (!prepareResponse.ok) {
      throw new Error(`Erreur préparation: ${prepareResponse.statusText}`);
    }

    const preparations: PreparationDto[] = await prepareResponse.json();

    // Démarre la préparation en cuisine et planifie la notification
    // Le `Promise.all` attend que toutes les préparations soient démarrées
    await Promise.all(preparations.map((prep) => OrderService.startPreparationAndNotify(prep)));

    console.log(`Order created successfully for table ${order.tableNumber}`);
    return preparations;
  },
  // CORRIGÉ : Cette fonction calcule maintenant le temps de préparation
  async startPreparationAndNotify(preparation: PreparationDto): Promise<void> {
    let allStartedItemsData: { meanCookingTimeInSec?: number }[] = [];

    // 1. Démarrer tous les items et récupérer leurs données de réponse
    if (preparation.preparedItems?.length) {
      const startPromises = preparation.preparedItems.map(async (item) => {
        const url = `${config.apiUrl}kitchen/preparedItems/${item._id}/start`;
        const response = await fetch(url, { method: 'POST' });

        if (!response.ok) {
          console.error(`Erreur démarrage de l'item ${item._id}: ${response.statusText}`);
          throw new Error(`Erreur démarrage de l'item ${item._id}`);
        }

        try {
          // JSON typé pour disposer de meanCookingTimeInSec
          const body = (await response.json()) as { meanCookingTimeInSec?: number };
          return body;
        } catch {
          throw new Error(`Réponse invalide pour l'item ${item._id}`);
        }
      });

      // On attend que toutes les requêtes soient terminées
      const results = await Promise.all(startPromises);

      // On ne garde que les résultats valides (non-null) avec un filtre typé
      allStartedItemsData = results.filter(
        (data): data is { meanCookingTimeInSec?: number } => data !== null
      );
    }

    // 2. Max du temps de cuisson renvoyé par les items
    const maxCookingTimeInSec = allStartedItemsData.reduce((max, currentItem) => {
      const t = currentItem.meanCookingTimeInSec ?? 0;
      return t > max ? t : max;
    }, 0);

    // 3. Fallback 20s si rien n'est renvoyé
    const preparationTimeInSec = maxCookingTimeInSec || 20;
    const targetMs = Date.now() + preparationTimeInSec * 1000;

    // 4. Planifier la notification de fin de préparation
    console.log(`Préparation ${preparation._id} sera prête dans ${preparationTimeInSec} secondes.`);
    scheduleAt(targetMs, () => {
      void OrderService.finishPrep(preparation);
    });
  },

  // Fonction inchangée, mais elle est maintenant appelée par `scheduleAt`
  async finishPrep(preparation: PreparationDto): Promise<PreparationDto> {
    const response = await fetch(
      `${config.apiUrl}kitchen/preparedItems/${preparation._id}/finish`,
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
    return response.json();
  },

  // Le reste des fonctions étaient correctes
  async serveToTable(id: string): Promise<PreparationDto> {
    const response = await fetch(`${config.apiUrl}kitchen/preparedItems/${id}/serveToTable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Erreur service préparation: ${response.statusText}`);
    }

    return response.json();
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
