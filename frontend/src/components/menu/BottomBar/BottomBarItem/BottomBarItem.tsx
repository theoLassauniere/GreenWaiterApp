import './BottomBarItem.scss';
import IconButton from '../../../common/IconButton/IconButton.tsx';
import type { CommandItem } from '../../../../models/CommandItem.ts';

type BottomBarItemProps = {
  item: CommandItem;
  onClick: () => void;
};

export default function BottomBarItem(props: BottomBarItemProps) {
  return (
    <div className="BottomBarItem">
      <div className="item-quantity">{props.item.quantity}</div>
      <div className="item-name">{props.item.name}</div>
      <IconButton
        onClick={props.onClick}
        icon={props.item.quantity > 1 ? 'close' : 'remove'}
        className="item-close-button"
      />
    </div>
  );
}
