import './group-menu.scss';
import type { GroupMenu } from '../models/group-menu.ts';
import type { TableType } from '../models/Table.ts';
import type { PageType } from '../models/Pages.ts';
import type { Category } from '../models/Category.ts';
import type { Item } from '../models/Item.ts';
import GroupMenuSelection from '../components/menu/group-menu/group-menu-selection.tsx';
import { useEffect, useState } from 'react';
import type { CommandItem } from '../models/CommandItem.ts';
import MenuItemBottomBar from '../components/menu/bottom-bar/menu-item-bottom-bar.tsx';
import MenuItemSelection from '../components/menu/menu-item-selection/menu-item-selection.tsx';
import { MenuService } from '../services/menu-service.ts';
import { OrderService } from '../services/order-service.ts';

type GroupMenuProps = {
  table?: TableType;
  onSelectPage: (page: PageType, tableNumber?: number) => void;
};

export default function GroupMenu(props: GroupMenuProps) {
  const [commandItems, setCommandItems] = useState<CommandItem[]>([]);
  const [listItems, setListItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [groupMenu, setGroupMenu] = useState<GroupMenu | undefined>(undefined);

  useEffect(() => {
    const loadGroupMenu = async () => {
      console.log(props.table);
      try {
        const menu = await MenuService.getGroupMenu(props.table?.tableNumber);
        setGroupMenu(menu);
      } catch (error) {
        console.error('Erreur lors du chargement du menu groupé', error);
      }
    };

    loadGroupMenu();
  }, [props.table?.tableNumber]);

  const handleSendOrder = async () => {
    try {
      await OrderService.sendGroupMenuOrder(
        props.table?.tableNumber,
        props.table?.groupNumber,
        commandItems
      );
      console.log('Commande envoyée avec succès');
    } catch (error) {
      console.error("Erreur lors de l'envoi", error);
    }
  };

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const items = await MenuService.getListItems(category);
      setListItems(items);
    } catch (e) {
      console.error(e);
      setListItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (item: Item) => {
    setCommandItems((prevItems) => {
      const existingItem = prevItems.find((ci) => ci.id === item.id);
      if (existingItem) {
        return prevItems.map((ci) =>
          ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (item: Item) => {
    setCommandItems((prevItems) => {
      const existingItem = prevItems.find((ci) => ci.id === item.id);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          return prevItems.map((ci) =>
            ci.id === item.id ? { ...ci, quantity: ci.quantity - 1 } : ci
          );
        } else {
          return prevItems.filter((ci) => ci.id !== item.id);
        }
      }
      return prevItems;
    });
  };

  const handleReturn = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="GroupMenu">
      <div className="item-selection">
        {selectedCategory === null ? (
          <div className="group-menu-selection">
            <GroupMenuSelection
              groupMenu={groupMenu}
              clickExtra={handleCategoryClick}
              onClickItem={handleAddItem}
            />
          </div>
        ) : (
          <div className="menu-grid">
            <MenuItemSelection
              listItems={listItems}
              table={props.table?.tableNumber}
              listSelectedItems={commandItems}
              onRemoveItem={handleRemoveItem}
              onSend={handleSendOrder}
              onReturn={handleReturn}
              loading={loading}
              onAddItem={handleAddItem}
            />
          </div>
        )}
      </div>
      {props.table && (
        <MenuItemBottomBar
          tableNumber={props.table.tableNumber}
          items={commandItems}
          onSend={handleSendOrder}
          onClick={handleAddItem}
          onRemoveItem={handleRemoveItem}
        />
      )}
    </div>
  );
}
