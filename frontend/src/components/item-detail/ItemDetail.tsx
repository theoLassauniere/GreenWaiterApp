import './itemDetail.scss';

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
  return (
    <div className="item-detail-card">
      <div className="item-header">
        <h1>{name}</h1>
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelectChange(e.target.checked)}
        />
      </div>
      <div className="item-quantity">
        <label htmlFor="quantity-select">Quantité :</label>
        <select
          id="quantity-select"
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
