import './group-menu-selection.css';
import type { GroupMenu } from '../../../models/GroupMenu.ts';
import CategoryItem from '../category-item/category-item.tsx';

type GroupMenuSelectionProps = {
  className?: string;
  groupMenu: GroupMenu;
};

export default function GroupMenuSelection({
  groupMenu,
  className,
}: Readonly<GroupMenuSelectionProps>) {
  return (
    <div className={`group-menu-selection ${className ?? ''}`}>
      {Object.entries(groupMenu.itemsByCategory).map(([category, items]) => (
        <CategoryItem key={category} category={category} items={items} />
      ))}
    </div>
  );
}
