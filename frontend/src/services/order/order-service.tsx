const baseUrl = "http://localhost:9500/kitchen";

// Personal implementation (bff)
export type OrderDto = {
    id: number;
    items: number[];
};

export type MenuItemDto = {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

// Teacher's implementation (web-services)
export type PreparationDto = {
    tableNumber: number;
    itemsToBeCooked: MenuItemShortDto[];
}

export type MenuItemShortDto = {
    menuItemShortName: string;
    howMany: number;
}

export const OrderService = {
    async createNewOrder(preparation: PreparationDto): Promise<OrderDto> {
        const payload = {
            tableNumber: preparation.tableNumber,
            itemsToBeCooked: preparation.itemsToBeCooked.map(item => ({
                menuItemShortName: item.menuItemShortName,
                howMany: item.howMany
            }))
        }
        const response = await fetch(`${baseUrl}/preparations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Erreur création commande: ${response.statusText}`);
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
