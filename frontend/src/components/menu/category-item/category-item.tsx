import './category-item.css';
import type { Item } from '../../../models/Item.ts';
import MenuItem from '../menu-item/menu-item.tsx';

type CategoryItemProps = {
  category: string;
  items: Item[];
  clickExtra?: () => void;
};

export default function CategoryItem({ category, items }: Readonly<CategoryItemProps>) {
  return (
    <div className="category-item">
      <h2 className="category-title">{category}</h2>
      <span
        onClick={() => {
          console.log('test');
        }}
        className={'category-open-extra'}
      >
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
