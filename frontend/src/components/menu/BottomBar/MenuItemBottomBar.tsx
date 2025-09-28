import './MenuItemBottomBar.scss';
import type { Item } from '../../../models/Item.ts';
import BottomBarItem from './BottomBarItem/BottomBarItem.tsx';

type MenuItemBottomBarProps = {
  tableNumber: number;
  items: Item[]; // ici a remplacé une fois le merge de mathis
  onClick: () => void;
  onRemoveItem(item: Item): void;
};

export default function MenuItemBottomBar(props: MenuItemBottomBarProps) {
  return (
    <div className="MenuItemBottomBar">
      <div className="bottom-bar-table-number">table : {props.tableNumber}</div>
      <div className="menu-items-container">
        {props.items.map((item) => (
          <BottomBarItem
            key={item.id}
            item={item}
            quantity={1}
            onClick={() => props.onRemoveItem(item)}
          />
        ))}
      </div>
      <div onClick={props.onClick} className="send-button">
        {' '}
        Envoyer
      </div>
    </div>
  );
}
