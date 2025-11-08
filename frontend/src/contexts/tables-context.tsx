import { type ReactNode, useState } from 'react';
import type { TableType } from '../models/Table.ts';
import { TablesContext } from './use-tables.ts';

export function TablesContextProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [tables, setTables] = useState<TableType[]>([]);

  function getTable(tableNumber: number): TableType {
    const table = tables.find((t) => t.tableNumber === tableNumber);
    if (!table) {
      throw new Error(`La table numéro ${tableNumber} n'existe pas.`);
    }
    return table;
  }

  function updateTable(tableNumber: number, updates: Partial<TableType>) {
    setTables(tables.map((t) => (t.tableNumber === tableNumber ? { ...t, ...updates } : t)));
  }

  return (
    <TablesContext.Provider value={{ tables, setTables, getTable, updateTable }}>
      {children}
    </TablesContext.Provider>
  );
}
