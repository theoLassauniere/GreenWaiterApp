import type { GroupMenu } from '../models/group-menu.ts';
import type { TableType } from '../models/Table.ts';
import type { PageType } from '../models/Pages.ts';
import type { Category } from '../models/Category.ts';
import type { Item } from '../models/Item.ts';
import GroupMenuSelection from '../components/menu/group-menu/group-menu-selection.tsx';
import { useMemo, useState } from 'react';
import type { CommandItem } from '../models/CommandItem.ts';
import MenuItemBottomBar from '../components/menu/bottom-bar/menu-item-bottom-bar.tsx';
import MenuItemSelection from '../components/menu/menu-item-selection/menu-item-selection.tsx';
import { MenuService } from '../services/menu-service.ts';

type GroupMenuProps = {
  GroupMenu?: GroupMenu;
  table?: TableType;
  onSelectPage: (page: PageType, tableNumber?: number) => void;
};

function mergeItems(a: CommandItem[], b: CommandItem[]): CommandItem[] {
  const map = new Map<string, CommandItem>();
  const add = (it: CommandItem) => {
    const existing = map.get(it.id);
    if (existing) {
      map.set(it.id, { ...existing, quantity: existing.quantity + it.quantity });
    } else {
      map.set(it.id, { ...it });
    }
  };
  a.forEach(add);
  b.forEach(add);
  return [...map.values()];
}

const addOrMergeItem = (
  setter: React.Dispatch<React.SetStateAction<CommandItem[]>>,
  itemToAdd: CommandItem
) => {
  setter((prev) => {
    const idx = prev.findIndex((i) => i.id === itemToAdd.id);
    if (idx < 0) return [...prev, { ...itemToAdd }];

    const updated = [...prev];
    updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + itemToAdd.quantity };
    return updated;
  });
};

export default function GroupMenu(props: GroupMenuProps) {
  const [groupMenuItems, setGroupMenuItems] = useState<CommandItem[]>([]);
  const [extraItems, setExtraItems] = useState<CommandItem[]>([]);
  const [listItems, setListItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const mergedItems = useMemo(
    () => mergeItems(groupMenuItems, extraItems),
    [groupMenuItems, extraItems]
  );

  const handleAddItem = (item: CommandItem) => {
    const groupCategoryItems =
      (item.category && props.GroupMenu.itemsByCategory[item.category]) || [];
    const isInGroupMenu = groupCategoryItems.some((i) => i.id === item.id);

    if (!isInGroupMenu) {
      addOrMergeItem(setExtraItems, item);
      return;
    }

    const currentQty = groupMenuItems.find((i) => i.id === item.id)?.quantity ?? 0;
    const maxQty = props.table?.capacity ?? Infinity;
    const available = Math.max(0, maxQty - currentQty);

    const forGroup = Math.min(item.quantity, available);
    const forExtra = item.quantity - forGroup;

    if (forGroup > 0) addOrMergeItem(setGroupMenuItems, { ...item, quantity: forGroup });
    if (forExtra > 0) addOrMergeItem(setExtraItems, { ...item, quantity: forExtra });
  };

  const handleRemoveItem = (item: CommandItem) => {
    if (extraItems.find((i) => i.id === item.id && i.quantity > 0)) {
      setExtraItems((prev) =>
        prev
          .map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0)
      );
    } else if (groupMenuItems.find((i) => i.id === item.id && i.quantity > 0)) {
      setGroupMenuItems((prev) =>
        prev
          .map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0)
      );
    }
  };

  const handleSendOrder = async () => {
    try {
      await MenuService.sendGroupMenuOrder(
        groupMenuItems.map((ci) => listItems.find((i) => i.id === ci.id)!).filter(Boolean),
        extraItems.map((ci) => listItems.find((i) => i.id === ci.id)!).filter(Boolean)
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

  const handleAddExtraItem = (item: Item) => {
    addOrMergeItem(setExtraItems, { ...item, quantity: 1 });
  };

  const handleReturn = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="GroupMenu">
      {selectedCategory === null ? (
        <div className="group-menu-selection">
          <GroupMenuSelection groupMenu={props.GroupMenu} clickExtra={handleCategoryClick} />
        </div>
      ) : (
        <div className="menu-grid">
          <MenuItemSelection
            listItems={listItems}
            table={props.table?.tableNumber}
            listSelectedItems={mergedItems}
            onAddItem={handleAddExtraItem}
            onRemoveItem={handleRemoveItem}
            onSend={handleSendOrder}
            onReturn={handleReturn}
            loading={loading}
          />
        </div>
      )}
      {props.table?.tableNumber && (
        <MenuItemBottomBar
          tableNumber={props.table.tableNumber}
          items={mergedItems}
          onSend={handleSendOrder}
          onClick={handleAddItem}
          onRemoveItem={handleRemoveItem}
        />
      )}
    </div>
  );
}
