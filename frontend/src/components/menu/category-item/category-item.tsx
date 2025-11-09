import './category-item.scss';
import type { Item } from '../../../models/Item.ts';
import MenuItem from '../menu-item/menu-item.tsx';
import Category, { getCategoryTitle } from '../../../models/Category.ts';

type CategoryItemProps = {
  category: Category; // au lieu de string
  items: Item[];
  onClickItem?: (item: Item) => void;
  clickExtra: (c: Category) => void;
  isCategoryFull: boolean;
};

export default function CategoryItem({
  category,
  items,
  clickExtra,
  onClickItem,
  isCategoryFull,
}: Readonly<CategoryItemProps>) {
  return (
    <div className="category-item">
      <p className="category-title">{getCategoryTitle(category)}</p>
      <div className="items-buttons">
        <div className="items-container">
          {items.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              disabled={isCategoryFull}
              onClick={
                onClickItem
                  ? () => onClickItem(item)
                  : () => {
                      console.error('erreur methode onClickItem non défini');
                    }
              }
            />
          ))}
        </div>
        <div onClick={() => clickExtra(category)} className={'category-open-extra'}>
          Extra
        </div>
      </div>
    </div>
  );
}
