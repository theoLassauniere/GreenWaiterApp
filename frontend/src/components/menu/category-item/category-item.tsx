import './category-item.scss';
import type { Item } from '../../../models/Item.ts';
import MenuItem from '../menu-item/menu-item.tsx';
import type Category from '../../../models/Category.ts';

type CategoryItemProps = {
  category: Category; // au lieu de string
  items: Item[];
  clickExtra: (c: Category) => void;
};

export default function CategoryItem({ category, items, clickExtra }: Readonly<CategoryItemProps>) {
  return (
    <div className="category-item">
      <h2 className="category-title">{category}</h2>
      <span onClick={() => clickExtra(category)} className={'category-open-extra'}>
        Extra
      </span>
      <div className="items-container">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
