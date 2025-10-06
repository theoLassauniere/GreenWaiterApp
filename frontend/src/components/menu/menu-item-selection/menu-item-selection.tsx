import './menu-item-selection.scss';
import type { Item } from '../../../models/Item.ts';
import MenuItem from '../../menu/menu-item/menu-item.tsx';
import SearchBar from '../../common/search-bar/search-bar.tsx';
import { useState } from 'react';
import IconButton from '../../common/icon-button/icon-button.tsx';
import type { CommandItem } from '../../../models/CommandItem.ts';
import MenuItemBottomBar from '../../menu/bottom-bar/menu-item-bottom-bar.tsx';
import Loader from '../../common/loader/loader.tsx';

type MenuItemSelectionProps = {
  listItems: Item[];
  listSelectedItems?: CommandItem[];
  onReturn?: () => void;
  table?: number;
  loading?: boolean;
};

export default function MenuItemSelection(props: MenuItemSelectionProps) {
  const [value, setValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<CommandItem[]>(props.listSelectedItems || []);

  const filteredList = props.listItems.filter((item: Item) =>
    item.name.toLowerCase().includes(value.toLowerCase())
  );

  const handleAddItem = (itemToAdd: Item) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((commandItem) => commandItem.id === itemToAdd.id);

      if (existingItem) {
        return prevItems.map((commandItem) =>
          commandItem.id === itemToAdd.id
            ? { ...commandItem, quantity: commandItem.quantity + 1 }
            : commandItem
        );
      } else {
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (itemToRemove: CommandItem) => {
    setSelectedItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemToRemove.id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

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
          {props.loading ? (
            <Loader />
          ) : (
            filteredList.map((item: Item) => (
              <MenuItem
                item={item}
                key={item.id}
                onClick={() => handleAddItem(item)}
                className="item"
              />
            ))
          )}
        </div>
        {props.table != null && (
          <div className="footer">
            <MenuItemBottomBar
              tableNumber={props.table}
              items={selectedItems}
              onClick={(item) => handleAddItem(item)}
              onRemoveItem={handleRemoveItem}
              onSend={() => console.log('Send command')}
            />
          </div>
        )}
      </div>
    </>
  );
}
