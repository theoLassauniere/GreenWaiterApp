import { type ReactNode, useCallback, useMemo, useState } from 'react';
import type { TableType } from '../models/Table.ts';
import { TablesContext } from './use-tables.ts';

// Utilise useCallback et useMemo pour garder les mêmes références et éviter de recréer si tables ne change pas
export function TablesContextProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [tables, setTables] = useState<TableType[]>([]);

  const getTable = useCallback(
    (tableNumber: number): TableType => {
      const table = tables.find((t) => t.tableNumber === tableNumber);
      if (!table) {
        throw new Error(`La table numéro ${tableNumber} n'existe pas.`);
      }
      return table;
    },
    [tables]
  );

  const updateTable = useCallback(
    (tableNumber: number, updates: Partial<TableType>) => {
      setTables(tables.map((t) => (t.tableNumber === tableNumber ? { ...t, ...updates } : t)));
    },
    [tables]
  );

  const contextValue = useMemo(
    () => ({ tables, setTables, getTable, updateTable }),
    [tables, getTable, updateTable]
  );

  return <TablesContext.Provider value={contextValue}>{children}</TablesContext.Provider>;
}
