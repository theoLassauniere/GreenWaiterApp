import config from '../config';
import { mockTables } from '../mocks/tables.ts';
import type { TableType } from '../models/Table.ts';

const baseUrl = config.bffFlag ? config.bffApi.replace(/\/$/, '') : '/api';

type RawTable = {
  _id: string;
  number: number;
  capacity?: number;
  taken: boolean;
  tableOrderId?: string | null;
};

export type StartOrderingDto = {
  tableNumber: number;
  customersCount: number;
};

export const TableService = {
  async listAllTables(): Promise<TableType[]> {
    if (config.bffFlag) {
      return this.listAllTablesFromBff();
    } else {
      return this.listAllTablesFromDining();
    }
  },

  async listAllTablesFromBff(): Promise<TableType[]> {
    const url = `${baseUrl}/tables`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur lors du fetch des tables (BFF): ${response.statusText}`);
    }
    return await response.json();
  },

  async listAllTablesFromDining(): Promise<TableType[]> {
    const url = `${baseUrl}/dining/tables`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur lors du fetch des tables (Dining): ${response.statusText}`);
    }
    const rawTables: RawTable[] = await response.json();
    return rawTables.map((t) => {
      const mock = mockTables.find((m) => m.tableNumber === t.number);
      return {
        id: t._id,
        tableNumber: t.number,
        capacity: mock?.capacity ?? 2,
        occupied: t.taken,
        commandState: mock?.commandState ?? undefined,
        isCommandesPage: false,
        commandPreparationPlace: mock?.commandPreparationPlace ?? undefined,
      };
    });
  },

  async seedTablesWithMocks(): Promise<TableType[]> {
    if (!config.bffFlag) {
      throw new Error('seedTablesWithMocks should only be called when BFF is enabled');
    }
    const response = await fetch(`${baseUrl}/tables/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockTables),
    });
    if (!response.ok) {
      throw new Error(`Erreur seed tables sur BFF: ${response.statusText}`);
    }
    return await response.json();
  },

  async addTable(table: { tableNumber: number }) {
    const payload = { number: table.tableNumber };
    const endpoint = config.bffFlag ? `${baseUrl}/tables/add` : `${baseUrl}/dining/tables`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Erreur création table: ${response.statusText}`);
    }
    return await response.json();
  },

  async openTable(order: StartOrderingDto) {
    const endpoint = config.bffFlag ? `${baseUrl}/tables/open` : `${baseUrl}/dining/tableOrders`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) {
      throw new Error(`Erreur ouverture table: ${response.statusText}`);
    }
    return await response.json();
  },
};
