import './item-detail.scss';
import { useEffect, useRef } from 'react';

export type ItemDetailProps = {
  name: string;
  quantity: number;
  selected: boolean;
  selectedQuantity: number;
  onSelectChange: (checked: boolean) => void;
  onQuantityChange: (value: number) => void;
};

export function ItemDetail({
  name,
  quantity,
  selected,
  selectedQuantity,
  onSelectChange,
  onQuantityChange,
}: Readonly<ItemDetailProps>) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const isIndeterminate = selectedQuantity > 0 && selectedQuantity < quantity;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="item-detail-card">
      <div className="item-header">
        <h1 className="item-title">{name}</h1>
        <input
          className="item-checkbox"
          type="checkbox"
          ref={checkboxRef}
          checked={selected}
          onChange={(e) => onSelectChange(e.target.checked)}
        />
      </div>
      <div className="item-quantity">
        <label htmlFor="quantity-select">Quantité :</label>
        <select
          className="quantity-select"
          value={selectedQuantity}
          onChange={(e) => onQuantityChange(Number(e.target.value))}
        >
          {[...Array(quantity + 1).keys()].map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <span>/ {quantity}</span>
      </div>
    </div>
  );
}
