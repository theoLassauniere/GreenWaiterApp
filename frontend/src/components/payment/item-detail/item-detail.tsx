import './item-detail.scss';
import { useEffect, useRef } from 'react';

export type ItemDetailProps = {
  name: string;
  disabled: boolean;
  quantity: number;
  selected: boolean;
  selectedQuantity: number;
  onSelectChange: (checked: boolean) => void;
  onQuantityChange: (value: number) => void;
};

export function ItemDetail(props: Readonly<ItemDetailProps>) {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const isIndeterminate = props.selectedQuantity > 0 && props.selectedQuantity < props.quantity;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="item-detail-card">
      <div className="item-header">
        <h1 className="item-title">{props.name}</h1>
        <input
          className="item-checkbox"
          type="checkbox"
          disabled={props.disabled}
          ref={checkboxRef}
          checked={props.selected}
          onChange={(e) => props.onSelectChange(e.target.checked)}
        />
      </div>
      <div className="item-quantity">
        <label htmlFor="quantity-select">Quantité :</label>
        <select
          className="quantity-select"
          disabled={props.disabled}
          value={props.selectedQuantity}
          onChange={(e) => props.onQuantityChange(Number(e.target.value))}
        >
          {[...new Array(props.quantity + 1).keys()].map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <span>/ {props.quantity}</span>
      </div>
    </div>
  );
}
