import { useState } from 'react';
import './tables.scss';
import Table, { type TableProps } from '../table/table';
import TableFilter from '../tables-filter/tables-filter';
import OccupiedTablesCheckbox from '../occupied-tables-checkbox/occupied-tables-checkbox';

type TablesProps = {
  readonly tables: readonly TableProps[];
};

export default function Tables({ tables }: Readonly<TablesProps>) {
  const [minCapacity, setMinCapacity] = useState<number | undefined>(undefined);
  const [showOccupied, setShowOccupied] = useState<boolean>(false);

  const filteredTables = tables.filter((t) => {
    const capacityOk = minCapacity ? t.capacity >= minCapacity : true;
    const occupiedOk = showOccupied ? t.occupied : true;
    return capacityOk && occupiedOk;
  });

  return (
    <div className="tables-container">
      <div className="tables-filters">
        <TableFilter tables={tables} minCapacity={minCapacity} onChange={setMinCapacity} />
        <OccupiedTablesCheckbox showOccupied={showOccupied} onChange={setShowOccupied} />
      </div>

      <div className="tables-grid">
        {filteredTables.map((t) => (
          <Table
            key={t.id}
            id={t.id}
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
