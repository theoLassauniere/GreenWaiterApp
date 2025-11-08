import { createContext, useContext } from 'react';
import type { TableType } from '../models/Table.ts';

interface TablesContextType {
  tables: TableType[];
  setTables: (tables: TableType[]) => void;
  getTable: (tableNumber: number) => TableType;
  updateTable: (tableNumber: number, updates: Partial<TableType>) => void;
}

export const TablesContext = createContext<TablesContextType | undefined>(undefined);

export const useTablesContext = () => {
  const context = useContext(TablesContext);
  if (!context) throw new Error('useTableOrder doit être utilisé dans TableOrderProvider');
  return context;
};
