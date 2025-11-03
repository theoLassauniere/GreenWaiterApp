import type { GroupMenu } from '../models/GroupMenu.ts';
import type { TableType } from '../models/Table.ts';
import type { PageType } from '../models/Pages.ts';
import GroupMenuSelection from '../components/menu/group-menu/group-menu-selection.tsx';

type GroupMenuProps = {
  GroupMenu: GroupMenu;
  table?: TableType;
  onSelectPage: (page: PageType, tableNumber?: number) => void;
};

export default function GroupMenu(props: GroupMenuProps) {
  return <div className="GroupMenu">{<GroupMenuSelection groupMenu={props.GroupMenu} />}</div>;
}
