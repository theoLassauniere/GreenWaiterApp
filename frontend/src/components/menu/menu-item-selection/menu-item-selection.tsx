import './menu-item-selection.scss';
import type { Item } from '../../../models/Item.ts';
import MenuItem from '../../menu/menu-item/menu-item.tsx';
import SearchBar from '../../common/search-bar/search-bar.tsx';
import { useState } from 'react';
import IconButton from '../../common/icon-button/icon-button.tsx';
import type { OrderItem } from '../../../models/OrderItem.ts';
import MenuItemBottomBar from '../../menu/bottom-bar/menu-item-bottom-bar.tsx';
import Loader from '../../common/loader/loader.tsx';

type MenuItemSelectionProps = {
  listItems: Item[];
  listSelectedItems: OrderItem[];
  onReturn?: () => void;
  table?: number;
  loading?: boolean;
  onAddItem: (item: Item) => void;
  onRemoveItem: (item: OrderItem) => void;
  onSend: () => void;
};

export default function MenuItemSelection({
  listItems,
  listSelectedItems,
  onReturn,
  table,
  loading,
  onAddItem,
  onRemoveItem,
  onSend,
}: MenuItemSelectionProps) {
  const [value, setValue] = useState('');

  const filteredList = listItems.filter((item: Item) =>
    (item.name ?? '').toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="menu-item-selection">
      <div className="menu-item-selection__header">
        <IconButton icon="arrow_back" onClick={onReturn} color="black" />
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
              onClick={() => onAddItem(item)}
              className="menu-item-selection__item"
            />
          ))
        )}
      </div>
      {typeof table === 'number' && (
        <div className="menu-item-selection__footer">
          <MenuItemBottomBar
            tableNumber={table}
            items={listSelectedItems}
            onClick={(item) => onAddItem(item)}
            onRemoveItem={onRemoveItem}
            onSend={onSend}
          />
        </div>
      )}
    </div>
  );
}
