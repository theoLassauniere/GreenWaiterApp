import './tables-filter.scss';
import { useMemo } from 'react';

type TableFilterProps = {
  readonly tables: readonly { capacity: number }[];
  readonly minCapacity: number | undefined;
  readonly onChange: (value: number | undefined) => void;
};

export default function TableFilter({ tables, minCapacity, onChange }: Readonly<TableFilterProps>) {
  const options = useMemo(() => {
    const maxCapacity = Math.max(...tables.map((t) => t.capacity), 1);
    return Array.from({ length: maxCapacity - 2 }, (_, i) => i + 3);
  }, [tables]);

  return (
    <div className="table-filter">
      <label>
        Filtrer par capacité :{' '}
        <select
          value={minCapacity ?? ''}
          onChange={(e) => {
            const value = e.target.value === '' ? undefined : Number(e.target.value);
            onChange(value);
          }}
        >
          <option value="">Toutes</option>
          {options.map((value) => (
            <option key={value} value={value}>
              {value}+
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
