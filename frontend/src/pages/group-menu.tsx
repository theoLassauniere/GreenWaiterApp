import type { GroupMenu } from '../models/GroupMenu.ts';
import type { TableType } from '../models/Table.ts';
import type { PageType } from '../models/Pages.ts';
import GroupMenuSelection from '../components/menu/group-menu/group-menu-selection.tsx';
import { useState } from 'react';
import type { Item } from '../models/Item.ts';
import type { CommandItem } from '../models/CommandItem.ts';
import MenuItemBottomBar from '../components/menu/bottom-bar/menu-item-bottom-bar.tsx';

type GroupMenuProps = {
  GroupMenu: GroupMenu;
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

//todo utilisé GroupMenuSelection pour afficher les items sélectionnés dans le group menu
//TODO géré les MenuItemBottomBar, il faut géré le truc de mix de group menu et de extra mais le mélangé dans MenuItemBottomBar, trouvé comment faire ça proprement
// TODO ENVOYÉ au back les items selectionnés
export default function GroupMenu(props: GroupMenuProps) {
  const [GroupMenu, setGroupMenu] = useState<CommandItem[]>([]);
  const [Extra, setExtra] = useState<CommandItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<CommandItem[]>([]);


  const mergedItems = useMemo(
    () => mergeItems(groupMenuItems, extraItems),
    [groupMenuItems, extraItems]
  );


  return <div className="GroupMenu">{
    <GroupMenuSelection groupMenu={props.GroupMenu} />
    <MenuItemBottomBar
    tableNumber={props.table.tableNumber}
    items={mergedItems}
    onSend={handleSendOrder}
    onClick={handleAddItem}
    onRemoveItem={handleRemoveItem}
  />
  }</div>;
}
