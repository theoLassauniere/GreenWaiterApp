import { useState, useEffect, useCallback } from 'react';
import './tables.scss';
import { Table } from '../components/tables/table/table.tsx';
import TableFilter from '../components/tables/tables-filter/tables-filter.tsx';
import SelectItemsCheckbox from '../components/common/select-items-checkbox/select-items-checkbox.tsx';
import { TableService } from '../services/table-service.ts';
import { mockTables } from '../mocks/tables.ts';
import * as React from 'react';
import config from '../config.ts';
import type { PageType } from '../models/Pages.ts';
import type { TableType } from '../models/Table.ts';

type TablesProps = {
  tables: TableType[];
  setTables: React.Dispatch<React.SetStateAction<TableType[]>>;
  onSelectPage: (page: PageType, tableNumber?: number) => void;
};

export default function Tables({ tables, setTables, onSelectPage }: Readonly<TablesProps>) {
  const [minCapacity, setMinCapacity] = useState<number | undefined>(undefined);
  const [showOccupied, setShowOccupied] = useState<boolean>(false);

  const loadTables = useCallback(async () => {
    try {
      if (config.bffFlag) {
        const tablesFromBff = await TableService.seedTablesWithMocks();
        setTables(tablesFromBff);
      } else {
        const existing = await seedTablesIfEmpty();
        await syncWithMocks(existing);
        setTables(existing);
      }
    } catch (err) {
      console.error('Erreur init tables', err);
    }
  }, [setTables]);

  useEffect(() => {
    void loadTables();
  }, [loadTables]);

  const filteredTables = tables.filter((t) => {
    const capacityOk = minCapacity ? t.capacity >= minCapacity : true;
    const occupiedOk = showOccupied ? t.occupied : true;
    return capacityOk && occupiedOk;
  });

  return (
    <div className="tables-container">
      <div className="tables-filters">
        <TableFilter tables={tables} minCapacity={minCapacity} onChange={setMinCapacity} />
        <SelectItemsCheckbox
          label="Afficher seulement les tables occupées"
          disabled={false}
          checked={showOccupied}
          onChange={setShowOccupied}
        />
      </div>

      <div className="tables-grid">
        {filteredTables.map((t) => (
          <Table table={t} key={t.id} onSelectPage={onSelectPage} />
        ))}
      </div>
    </div>
  );
}

async function seedTablesIfEmpty(): Promise<TableType[]> {
  const existing = await TableService.listAllTables();
  if (existing.length > 0) return existing;

  for (const table of mockTables) {
    await TableService.addTable({ tableNumber: table.tableNumber });
    if (table.occupied) {
      await TableService.openTableForOrders({
        tableNumber: table.tableNumber,
        customersCount: table.capacity ?? 2,
      });
    }
  }
  return [...mockTables];
}

async function syncWithMocks(existing: TableType[]): Promise<void> {
  for (const mock of mockTables) {
    const found = existing.find((t) => t.tableNumber === mock.tableNumber);

    if (!found) {
      if (mock.occupied) {
        await TableService.openTableForOrders({
          tableNumber: mock.tableNumber,
          customersCount: mock.capacity ?? 2,
        });
      }
    } else if (mock.occupied && !found.occupied) {
      await TableService.openTableForOrders({
        tableNumber: mock.tableNumber,
        customersCount: mock.capacity ?? 2,
      });
    }
  }
}
