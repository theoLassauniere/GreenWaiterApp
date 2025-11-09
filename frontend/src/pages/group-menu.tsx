import './group-menu.scss';
import type { GroupMenu } from '../models/group-menu.ts';
import type { TableType } from '../models/Table.ts';
import type { PageType } from '../models/Pages.ts';
import type { Category } from '../models/Category.ts';
import type { Item } from '../models/Item.ts';
import GroupMenuSelection from '../components/menu/group-menu/group-menu-selection.tsx';
import { useEffect, useMemo, useState } from 'react';
import MenuItemBottomBar from '../components/menu/bottom-bar/menu-item-bottom-bar.tsx';
import MenuItemSelection from '../components/menu/menu-item-selection/menu-item-selection.tsx';
import { MenuService } from '../services/menu-service.ts';
import { OrderService } from '../services/order-service.ts';
import type { OrderItem } from '../models/OrderItem.ts';

type GroupMenuProps = {
  table?: TableType;
  onSelectPage: (page: PageType, tableNumber?: number) => void;
  onReturn: () => void;
};

export function GroupMenu(props: Readonly<GroupMenuProps>) {
  const [orderGroupMenuItems, setOrderGroupMenuItems] = useState<OrderItem[]>([]);
  const [orderGroupMenuExtras, setOrderGroupMenuExtras] = useState<OrderItem[]>([]);
  const [listItems, setListItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [groupMenu, setGroupMenu] = useState<GroupMenu | undefined>(undefined);
  const fullState = useMemo<Record<Category, boolean>>(() => {
    if (!groupMenu) return {} as Record<Category, boolean>;

    const state = {} as Record<Category, boolean>;
    const maxMenuCount = Math.min(
      groupMenu.maxMembers - groupMenu.menuCount,
      props.table?.capacity || 0
    );
    for (const category in groupMenu.itemsByCategory) {
      const commandedInCategory = orderGroupMenuItems
        .filter((ci) => ci.category === (category as Category))
        .reduce((sum, ci) => sum + ci.quantity, 0);

      state[category as Category] = commandedInCategory >= maxMenuCount;
    }

    return state;
  }, [groupMenu, orderGroupMenuItems, props.table?.capacity]);
  useEffect(() => {
    const loadGroupMenu = async () => {
      try {
        const menu = await MenuService.getGroupMenu(props.table?.groupId);
        setGroupMenu(menu);
      } catch (error) {
        console.error('Erreur lors du chargement du menu groupé', error);
      }
    };

    loadGroupMenu();
  }, [props.table?.groupId, props.table?.tableNumber]);

  const handleSendOrder = async () => {
    try {
      await OrderService.sendGroupMenuOrder(props.table?.tableNumber, props.table?.groupId, {
        items: orderGroupMenuItems,
        extras: orderGroupMenuExtras,
      });
      setOrderGroupMenuItems([]);
      setOrderGroupMenuExtras([]);
      props.onReturn();
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

  function addItem(prevItems: OrderItem[], item: Item) {
    const existingItem = prevItems.find(
      (ci) => ci.id === item.id && ci.shortName === item.shortName
    );
    if (existingItem) {
      return prevItems.map((ci) => (ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci));
    } else {
      return [...prevItems, { ...item, quantity: 1 }];
    }
  }

  function removeItem(prevItems: OrderItem[], item: Item) {
    const existingItem = prevItems.find(
      (ci) => ci.id === item.id && ci.shortName === item.shortName
    );
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
  }

  const handleAddItem = (item: Item, extra = false) => {
    setGroupMenu((prevMenu) => {
      if (prevMenu && item.category === 'MAIN') prevMenu.menuCount++;
      return prevMenu;
    });
    if (!extra) {
      setOrderGroupMenuItems((prevItems) => {
        return addItem(prevItems, item);
      });
    } else {
      setOrderGroupMenuExtras((prevItems) => {
        if (!item.shortName.includes('_extra')) item.shortName = item.shortName + '_extra';
        return addItem(prevItems, item);
      });
    }
  };

  const handleRemoveItem = (item: Item, extra = false) => {
    setGroupMenu((prevMenu) => {
      if (prevMenu && item.category === 'MAIN') prevMenu.menuCount--;
      return prevMenu;
    });
    if (!extra) {
      setOrderGroupMenuItems((prevItems) => {
        return removeItem(prevItems, item);
      });
    } else {
      setOrderGroupMenuExtras((prevItems) => {
        return removeItem(prevItems, item);
      });
    }
  };

  const handleReturn = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="GroupMenu">
      <div className="item-selection">
        {groupMenu && props.table && (
          <p className="">
            Menus restants à commander :{' '}
            {Math.min(groupMenu.maxMembers - groupMenu.menuCount, props.table.capacity)}
          </p>
        )}
        {selectedCategory === null ? (
          <div className="group-menu-selection">
            <GroupMenuSelection
              groupMenu={groupMenu}
              clickExtra={handleCategoryClick}
              onClickItem={handleAddItem}
              fullState={fullState}
            />
          </div>
        ) : (
          <div className="menu-grid">
            <MenuItemSelection
              listItems={listItems}
              table={props.table?.tableNumber}
              listSelectedItems={orderGroupMenuExtras}
              onRemoveItem={(item) => handleRemoveItem(item, true)}
              onSend={handleSendOrder}
              onReturn={handleReturn}
              loading={loading}
              onAddItem={(item) => handleAddItem(item, true)}
              disabled={true}
            />
          </div>
        )}
      </div>
      {props.table && (
        <div className="bottom-bar">
          <MenuItemBottomBar
            tableNumber={props.table.tableNumber}
            items={[...orderGroupMenuItems, ...orderGroupMenuExtras]}
            onSend={handleSendOrder}
            onClick={handleAddItem}
            onRemoveItem={(item) => {
              if (item.shortName.includes('_extra')) handleRemoveItem(item, true);
              else handleRemoveItem(item);
            }}
          />
        </div>
      )}
    </div>
  );
}
