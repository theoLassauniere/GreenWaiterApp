import './BottomBarItem.scss';
import IconButton from '../../../common/IconButton/IconButton.tsx';
import type { CommandItem } from '../../../../models/CommandItem.ts';

type BottomBarItemProps = {
  item: CommandItem;
  onClick: (item: CommandItem) => void;
  onRemove: (item: CommandItem) => void;
};

export default function BottomBarItem(props: BottomBarItemProps) {
  return (
    <div className="BottomBarItem">
      <div className="item-quantity" onClick={() => props.onClick(props.item)}>
        {props.item.quantity}
      </div>
      <div className="item-name">{props.item.name}</div>
      <IconButton
        onClick={() => props.onRemove(props.item)}
        icon={props.item.quantity > 1 ? 'remove' : 'close'}
        className="item-close-button"
      />
    </div>
  );
}
