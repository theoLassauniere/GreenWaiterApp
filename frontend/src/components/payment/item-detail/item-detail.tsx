import './item-detail.scss';
import { useEffect, useRef, useState } from 'react';
import { SplitPopup } from '../split-popup/split-popup.tsx';

export type ItemDetailProps = {
  name: string;
  disabled: boolean;
  quantity: number;
  selected: boolean;
  selectedQuantity: number;
  divider?: number;
  tableCapacity: number;
  onSelectChange: (checked: boolean) => void;
  onQuantityChange: (value: number) => void;
  onSplitItem: (divider: number) => void;
};

export function ItemDetail(props: Readonly<ItemDetailProps>) {
  const [showSplitPopup, setShowSplitPopup] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const isIndeterminate = props.selectedQuantity > 0 && props.selectedQuantity < props.quantity;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const generateQuantityOptions = () => {
    const divider = props.divider || 1;
    const maxQuantity = props.quantity;
    const options = [];

    for (let i = 0; i <= maxQuantity * divider; i++) {
      const value = i / divider;
      options.push(value);
    }

    return options;
  };

  return (
    <div className="item-detail-card">
      <div className="item-header">
        <h1 className="item-title">{props.name}</h1>
        <input
          className="item-checkbox"
          type="checkbox"
          disabled={props.disabled}
          ref={checkboxRef}
          checked={props.selected ?? false}
          onChange={(e) => props.onSelectChange(e.target.checked)}
        />
      </div>
      <div className="item-quantity">
        <div className="quantity-info">
          <label htmlFor="quantity-select">Quantité :</label>
          <select
            className="quantity-select"
            disabled={props.disabled}
            value={props.selectedQuantity}
            onChange={(e) => props.onQuantityChange(Number(e.target.value))}
          >
            {generateQuantityOptions().map((value) => (
              <option key={value} value={value}>
                {value % 1 === 0 ? value.toString() : value.toFixed(2)}
              </option>
            ))}
          </select>
          <span>/ {props.quantity.toFixed(2)}</span>
        </div>
        <button
          className="share-btn"
          disabled={props.disabled}
          onClick={() => setShowSplitPopup(true)}
          title="Partager l'item"
        >
          ÷
        </button>
      </div>
      {showSplitPopup && (
        <SplitPopup
          isOpen={showSplitPopup}
          title={'Pour combien de personnes diviser cet élément ?'}
          splitMax={props.tableCapacity}
          onSplit={props.onSplitItem}
          onClose={() => setShowSplitPopup(false)}
        />
      )}
    </div>
  );
}
