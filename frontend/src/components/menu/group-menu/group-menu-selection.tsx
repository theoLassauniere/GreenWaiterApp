import './group-menu-selection.scss';
import type { GroupMenu } from '../../../models/group-menu.ts';
import CategoryItem from '../category-item/category-item.tsx';
import type Category from '../../../models/Category.ts';

type GroupMenuSelectionProps = {
  className?: string;
  groupMenu: GroupMenu;
  clickExtra: (category: Category) => void;
};

export default function GroupMenuSelection({
  groupMenu,
  className,
  clickExtra,
}: Readonly<GroupMenuSelectionProps>) {
  return (
    <div className={`group-menu-selection ${className ?? ''}`}>
      {(Object.keys(groupMenu.itemsByCategory) as Category[]).map((category) => (
        <CategoryItem
          key={category}
          category={category}
          items={groupMenu.itemsByCategory[category]}
          clickExtra={() => clickExtra(category)}
        />
      ))}
    </div>
  );
}
