import './menu.scss';
import { mockFoodCategories } from '../models/food-categories.ts';
import FoodCategory from '../components/menu/food-category/food-category.tsx';
import MenuItemSelection from '../components/menu/menu-item-selection/menu-item-selection.tsx';
import { getListItems } from '../services/item-service.ts';
import { forwardRef, useImperativeHandle, useState } from 'react';
import type { Category } from '../models/Category.ts';
import type { Item } from '../models/Item.ts';

interface MenuProps {
  tableId?: number;
}

export interface MenuHandle {
  onReturn: () => void;
}

export const Menu = forwardRef<MenuHandle, MenuProps>((MenuProps, ref) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [listItems, setListItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const onReturn = () => {
    setSelectedCategory(null);
    setListItems([]);
  };

  useImperativeHandle(ref, () => ({
    onReturn,
  }));

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const items = await getListItems(category);
      setListItems(items);
    } catch (e) {
      console.error(e);
      setListItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {selectedCategory === null ? (
        <div className="categories-grid">
          {mockFoodCategories.map((cat, i) => (
            <FoodCategory
              key={i}
              id={cat.category}
              title={cat.title}
              imageUrl={cat.imageUrl}
              onClick={() => handleCategoryClick(cat.category)}
            />
          ))}
        </div>
      ) : (
        <div className="menu-grid">
          <MenuItemSelection
            listItems={listItems}
            table={MenuProps.tableId}
            onReturn={onReturn}
            loading={loading}
          />
        </div>
      )}
    </>
  );
});
