import './MenuItemBottomBar.scss';
import BottomBarItem from './BottomBarItem/BottomBarItem.tsx';
import type { CommandItem } from '../../../models/CommandItem.ts';

type MenuItemBottomBarProps = {
  tableNumber: number;
  items: CommandItem[]; // ici a remplacé une fois le merge de mathis
  onClick: () => void;
  onRemoveItem(item: CommandItem): void;
};

export default function MenuItemBottomBar(props: MenuItemBottomBarProps) {
  return (
    <div className="MenuItemBottomBar">
      <div className="bottom-bar-table-number">table : {props.tableNumber}</div>
      <div className="menu-items-container">
        {props.items.map((item) => (
          <BottomBarItem key={item.id} item={item} onClick={() => props.onRemoveItem(item)} />
        ))}
      </div>
      <div onClick={props.onClick} className="send-button">
        {' '}
        Envoyer
      </div>
    </div>
  );
}
