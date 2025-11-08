import './menu-item-bottom-bar.scss';
import BottomBarItem from './bottom-bar-item/bottom-bar-item.tsx';
import type { OrderItem } from '../../../models/OrderItem.ts';

type MenuItemBottomBarProps = {
  tableNumber: number;
  items: OrderItem[];
  onSend: () => void;
  onClick: (item: OrderItem) => void;
  onRemoveItem(item: OrderItem): void;
};

export default function MenuItemBottomBar(props: MenuItemBottomBarProps) {
  const hasItems = props.items.length > 0;

  return (
    <div className="MenuItemBottomBar">
      <div className="bottom-bar-table-number">Table : {props.tableNumber}</div>
      <div className="menu-items-container">
        {props.items.map((item) => (
          <BottomBarItem
            key={item.id}
            item={item}
            onClick={() => props.onClick(item)}
            onRemove={() => props.onRemoveItem(item)}
          />
        ))}
      </div>
      <div
        onClick={hasItems ? props.onSend : undefined}
        className={`send-button ${!hasItems ? 'disabled' : ''}`}
      >
        Envoyer
      </div>
    </div>
  );
}
