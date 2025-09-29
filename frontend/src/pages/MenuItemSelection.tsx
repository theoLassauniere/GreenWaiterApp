import './MenuItemSelection.scss';
import type { Item } from '../models/Item.ts';
import MenuItem from '../components/menu/MenuItem/MenuItem.tsx';
import SearchBar from '../components/common/SearchBar.tsx';
import { useState } from 'react';
import IconButton from '../components/common/IconButton/IconButton.tsx';

type MenuItemSelectionProps = {
  listItems: Item[];
  onReturn?: () => void;
};

export default function MenuItemSelection(props: MenuItemSelectionProps) {
  const [value, setValue] = useState('');

  const filtredList = props.listItems.filter((item: Item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <>
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
          {filtredList.map((item: Item) => (
            <MenuItem item={item} key={item.id} className={'item'} />
          ))}
        </div>
      </div>
    </>
  );
}
