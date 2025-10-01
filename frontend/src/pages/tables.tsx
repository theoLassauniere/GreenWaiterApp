import { useState, useEffect, useCallback } from 'react';
import './tables.scss';
import Table, { type TableProps } from '../components/tables/table/table.tsx';
import TableFilter from '../components/tables/tables-filter/tables-filter.tsx';
import SelectItemsCheckbox from '../components/common/select-items-checkbox/select-items-checkbox.tsx';
import { TableService } from '../services/table-service.tsx';
import { mockTables } from '../mocks/tables.ts';
import * as React from 'react';
import config from '../config.ts';

type TablesProps = {
  tables: TableProps[];
  setTables: React.Dispatch<React.SetStateAction<TableProps[]>>;
};

export default function Tables({ tables, setTables }: Readonly<TablesProps>) {
  const [minCapacity, setMinCapacity] = useState<number | undefined>(undefined);
  const [showOccupied, setShowOccupied] = useState<boolean>(false);

  async function seedTablesIfEmpty(): Promise<void> {
    const existing = await TableService.listAllTables();
    if (existing.length > 0) return;

    for (const table of mockTables) {
      await TableService.addTable({ tableNumber: table.tableNumber });
      if (table.occupied) {
        await TableService.openTable({
          tableNumber: table.tableNumber,
          customersCount: table.capacity ?? 2,
        });
      }
    }
  }

  async function syncWithMocks(existing: TableProps[]): Promise<void> {
    for (const mock of mockTables) {
      const found = existing.find((t) => t.tableNumber === mock.tableNumber);

      if (!found) {
        if (mock.occupied) {
          await TableService.openTable({
            tableNumber: mock.tableNumber,
            customersCount: mock.capacity ?? 2,
          });
        }
      } else if (mock.occupied && !found.occupied) {
        await TableService.openTable({
          tableNumber: mock.tableNumber,
          customersCount: mock.capacity ?? 2,
        });
      }
    }
  }

  const loadTables = useCallback(async () => {
    try {
      if (config.bffFlag) {
        const tablesFromBff = await TableService.seedTablesWithMocks();
        setTables(tablesFromBff);
      } else {
        await seedTablesIfEmpty();
        let existing = await TableService.listAllTables();
        await syncWithMocks(existing);
        existing = await TableService.listAllTables();
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
          checked={showOccupied}
          onChange={setShowOccupied}
        />
      </div>

      <div className="tables-grid">
        {filteredTables.map((t) => (
          <Table
            key={t.id}
            id={t.id}
            tableNumber={t.tableNumber}
            capacity={t.capacity}
            occupied={t.occupied}
            isCommandesPage={t.isCommandesPage}
            commandState={t.commandState}
            commandPreparationPlace={t.commandPreparationPlace}
          />
        ))}
      </div>
    </div>
  );
}
