import './BottomBarItem.scss';
import IconButton from '../../../common/IconButton/IconButton.tsx';
import type { Item } from '../../../../models/Item.ts';

type BottomBarItemProps = {
  item: Item;
  quantity: number;
  onClick: () => void;
};

export default function BottomBarItem(props: BottomBarItemProps) {
  return (
    <div className="BottomBarItem">
      <div className="item-quantity">{props.quantity}</div>
      <div className="item-name">{props.item.name}</div>
      <IconButton
        onClick={props.onClick}
        icon={props.quantity > 1 ? 'close' : 'remove'}
        className="item-close-button"
      />
    </div>
  );
}
