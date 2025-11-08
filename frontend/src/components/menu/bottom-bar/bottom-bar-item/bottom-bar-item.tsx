import './bottom-bar-item.scss';
import IconButton from '../../../common/icon-button/icon-button.tsx';
import type { OrderItem } from '../../../../models/OrderItem.ts';

type BottomBarItemProps = {
  item: OrderItem;
  onClick: (item: OrderItem) => void;
  onRemove: (item: OrderItem) => void;
};

export default function BottomBarItem(props: BottomBarItemProps) {
  return (
    <div className="BottomBarItem">
      <div className="item-quantity" onClick={() => props.onClick(props.item)}>
        {props.item.quantity}
      </div>
      <div className="item-name">{props.item.shortName}</div>
      <IconButton
        onClick={() => props.onRemove(props.item)}
        icon={props.item.quantity > 1 ? 'remove' : 'close'}
        className="item-close-button"
      />
    </div>
  );
}
