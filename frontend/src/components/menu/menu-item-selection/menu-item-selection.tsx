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

export default function MenuItemSelection({
  listItems,
  listSelectedItems,
  onReturn,
  table,
  loading,
}: MenuItemSelectionProps) {
  const [value, setValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<CommandItem[]>(listSelectedItems || []);

  const filteredList = listItems.filter((item: Item) =>
    (item.name ?? '').toLowerCase().includes(value.toLowerCase())
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
        const newCommandItem: CommandItem = { ...itemToAdd, quantity: 1 };
        return [...prevItems, newCommandItem];
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
    <div className="menu-item-selection">
      <div className="menu-item-selection__header">
        <IconButton icon="arrow_back" onClick={onReturn} />
        <SearchBar
          value={value}
          onChange={setValue}
          placeholder="Search items..."
          className="menu-item-selection__search"
        />
      </div>

      <div
        className={`menu-item-selection__list ${
          loading ? 'is-loading' : listItems.length > 0 ? 'has-items' : ''
        }`}
      >
        {loading ? (
          <div className="menu-item-selection__loading">
            <Loader />
          </div>
        ) : (
          filteredList.map((item: Item) => (
            <MenuItem
              item={item}
              key={item.id}
              onClick={() => handleAddItem(item)}
              className="menu-item-selection__item"
            />
          ))
        )}
      </div>
      {typeof table === 'number' && (
        <div className="menu-item-selection__footer">
          <MenuItemBottomBar
            tableNumber={table}
            items={selectedItems}
            onClick={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onSend={() => console.log('Send command')}
          />
        </div>
      )}
    </div>
  );
}
