import { useState, useEffect, useCallback } from 'react';
import './tables.scss';
import { Table } from '../components/tables/table/table.tsx';
import TableFilter from '../components/tables/tables-filter/tables-filter.tsx';
import SelectItemsCheckbox from '../components/common/select-items-checkbox/select-items-checkbox.tsx';
import { TableService } from '../services/table-service.ts';
import { mockTables } from '../mocks/tables.ts';
import config from '../config.ts';
import type { PageType } from '../models/Pages.ts';
import type { TableType } from '../models/Table.ts';
import { useTablesContext } from '../contexts/use-tables.ts';
import { Pages } from '../models/Pages.ts';

type TablesProps = {
  onSelectPage: (
    page: PageType,
    tableNumber?: number,
    preparationId?: string,
    groupId?: number
  ) => void;
  readonly handleUpdateTable: (tableNumber: number, updates: Partial<TableType>) => void;
};

export default function Tables({ onSelectPage, handleUpdateTable }: Readonly<TablesProps>) {
  const [minCapacity, setMinCapacity] = useState<number | undefined>(undefined);
  const [showOccupied, setShowOccupied] = useState<boolean>(false);
  const { tables, setTables } = useTablesContext();

  const loadTables = useCallback(async () => {
    try {
      if (config.bffFlag) {
        if (tables.length === 0) {
          const tablesFromBff = await TableService.seedTablesWithMocks();
          setTables(tablesFromBff);
        }
      } else {
        const existing = await TableService.listAllTables();
        if (existing.length === 0) {
          const existing = await seedTablesIfEmpty();
          await syncWithMocks(existing);
          setTables(existing);
        }
      }
    } catch (err) {
      console.error("Erreur d'initialisation des tables :", err);
    }
  }, [setTables, tables.length]);

  useEffect(() => {
    void loadTables();
  }, [loadTables]);

  // A simplifier si possible
  const handleGroupUpdate = async (tableNumber: number, updates: Partial<TableType>) => {
    const clicked = tables.find((t: TableType) => t.tableNumber === tableNumber);
    if (!clicked) return;

    let updatedTables: TableType[];

    if (clicked.groupId && updates.occupied) {
      updatedTables = tables.map((t: TableType) =>
        t.groupId === clicked.groupId ? { ...t, ...updates } : t
      );
    } else {
      updatedTables = tables.map((t: TableType) =>
        t.tableNumber === tableNumber ? { ...t, ...updates } : t
      );
    }

    setTables(updatedTables);
    handleUpdateTable(tableNumber, updates);

    try {
      if (updates.occupied) {
        if (clicked.groupId) {
          const groupTables = tables.filter((t: TableType) => t.groupId === clicked.groupId);
          await Promise.all(
            groupTables.map((t: TableType) =>
              TableService.openTableForOrders({
                tableNumber: t.tableNumber,
                customersCount: t.capacity ?? 2,
              })
            )
          );
        } else {
          await TableService.openTableForOrders({
            tableNumber,
            customersCount: clicked.capacity ?? 2,
          });
        }
      }
    } catch (err) {
      console.error("Erreur lors de l'ouverture des tables du groupe :", err);
    }
  };

  const groupsServed = Object.entries(
    tables.reduce<Record<number, TableType[]>>((acc, table) => {
      if (!table.groupId) return acc;
      acc[table.groupId] = acc[table.groupId] || [];
      acc[table.groupId].push(table);
      return acc;
    }, {})
  )
    .filter(([, groupTables]) => groupTables.every((t) => t.orderState === 'served'))
    .map(([groupId]) => Number(groupId));

  const filteredTables = tables.filter((t: TableType) => {
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
      <div className="tables-grid-container">
        <div className="tables-grid">
          {filteredTables.map((t) => (
            <div key={t.id} className="table-wrapper">
              <Table table={t} onSelectPage={onSelectPage} onUpdateTable={handleGroupUpdate} />
            </div>
          ))}
        </div>

        {groupsServed.map((groupId) => {
          const groupTables = filteredTables.filter((t) => t.groupId === groupId);
          if (groupTables.length === 0) return null;

          return (
            <div
              key={groupId}
              className="group-pay-button"
              style={{
                gridColumn: '1 / -1',
              }}
            >
              <button
                className="pay-btn"
                onClick={() => onSelectPage(Pages.Paiement, undefined, undefined, groupId)}
              >
                Paiement du groupe {groupId}
              </button>
            </div>
          );
        })}
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
