import './group-menu-selection.scss';
import type { GroupMenu } from '../../../models/group-menu.ts';
import CategoryItem from '../category-item/category-item.tsx';
import Category from '../../../models/Category.ts';
import type { Item } from '../../../models/Item.ts';
import Loader from '../../common/loader/loader.tsx';

type GroupMenuSelectionProps = {
  className?: string;
  groupMenu?: GroupMenu;
  clickExtra: (category: Category) => void;
  onClickItem?: (item: Item) => void;
  fullState?: Record<Category, boolean>;
};

export default function GroupMenuSelection({
  groupMenu,
  className,
  clickExtra,
  onClickItem,
  fullState = {} as Record<Category, boolean>,
}: Readonly<GroupMenuSelectionProps>) {
  return (
    <div className={`group-menu-selection ${className ?? ''}`}>
      {!groupMenu ? (
        <div className="group-menu-selection__loading">
          <Loader />
        </div>
      ) : (
        Object.values(Category).map((category) => (
          <CategoryItem
            key={category}
            category={category}
            items={groupMenu.itemsByCategory[category] || []}
            clickExtra={() => clickExtra(category)}
            onClickItem={onClickItem}
            isCategoryFull={fullState[category] || false}
          />
        ))
      )}
    </div>
  );
}
