import './menu-item-selection.scss';
import type { Item } from '../../../models/Item.ts';
import SearchBar from '../../common/search-bar/search-bar.tsx';
import { useState } from 'react';
import IconButton from '../../common/icon-button/icon-button.tsx';
import MenuItem from '../menu-item/menu-item.tsx';

type MenuItemSelectionProps = {
  listItems: Item[];
  onReturn?: () => void;
};

export default function MenuItemSelection(props: MenuItemSelectionProps) {
  const [value, setValue] = useState('');

  const filteredList = props.listItems.filter((item: Item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="menu-item-selection">
      <div className="header">
        <IconButton icon={'arrow_back'} onClick={props.onReturn} />
        <SearchBar
          value={value}
          onChange={(val) => setValue(val)}
          placeholder="Search items..."
          className="MenuItemSearchBar"
        />
      </div>
      <div className="MenuItemSelection">
        {filteredList.map((item: Item) => (
          <MenuItem item={item} key={item.id} className={'item'} />
        ))}
      </div>
    </div>
  );
}
