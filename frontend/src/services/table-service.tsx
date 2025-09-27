import config from '../config';

const baseUrl = config.bffFlag ? config.bffApi.replace(/\/$/, '') : '/api';

export type TableDto = {
  id: number;
  capacity: number;
  occupied: boolean;
};

export type TableWithOrderDto = {
  id: number;
  capacity: number;
  occupied: boolean;
  currentOrderId?: number;
};

export type StartOrderingDto = {
  tableNumber: number;
  customersCount: number;
};

export const TableService = {
  async listAllTables(): Promise<TableWithOrderDto[]> {
    const response = await fetch(`${baseUrl}/dining/tables`);
    if (!response.ok) {
      throw new Error(`Erreur lors du fetch des tables: ${response.statusText}`);
    }
    return response.json();
  },

  async addTable(table: { number: number; capacity: number }) {
    const response = await fetch(`${baseUrl}/dining/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(table),
    });
    if (!response.ok) throw new Error(`Erreur création table: ${response.statusText}`);
    return response.json();
  },

  async openTable(order: StartOrderingDto) {
    const response = await fetch(`${baseUrl}/dining/tableOrders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error(`Erreur ouverture table: ${response.statusText}`);
    return response.json();
  },
};
