import config from '../config';
import { mockTables } from '../mocks/tables.ts';
import type { TableProps } from '../components/tables/table/table.tsx';

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
  async listAllTables(): Promise<TableProps[]> {
    const response = await fetch(`${baseUrl}/dining/tables`);
    if (!response.ok) {
      throw new Error(`Erreur lors du fetch des tables: ${response.statusText}`);
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
        isCommandesPage: mock?.isCommandesPage ?? undefined,
        commandPreparationPlace: mock?.commandPreparationPlace ?? undefined,
      };
    });
  },

  async addTable(table: { tableNumber: number }) {
    const payload = { number: table.tableNumber };
    const response = await fetch(`${baseUrl}/dining/tables`, {
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
    const response = await fetch(`${baseUrl}/dining/tableOrders`, {
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
