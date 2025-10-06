import './menu.scss';
import { mockFoodCategories } from '../models/food-categories.ts';
import FoodCategory from '../components/menu/food-category/food-category.tsx';
import MenuItemSelection from '../components/menu/menu-item-selection/menu-item-selection.tsx';
import type Category from '../models/Category.ts';
import config from '../../../config';

export type MenuProps = {
  selectedCategory: number | null;
  setSelectedCategory: (cat: number | null) => void;
};

export function Menu(props: Readonly<MenuProps>) {
  const getListItems = (category: Category) => {
    config.bffFlag ? getListItemsBFF(category) : getListItemsNoBFF(category);
  };

  const getListItemsBFF = (category: Category) => {
    try {
      const res = await fetch(`${config.bffApi}//${id}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        console.error('Erreur HTTP allergènes', res.status);
        return [];
      }
      const payload = await res.json();
      return Array.isArray(payload) ? payload : (payload ?? []);
    } catch (e) {
      console.error('Erreur réseau allergènes', e);
      return [];
    }
  };
  const getListItemsNoBFF = (category: Category) => {
    try {
      const res = await fetch(`${config.apiUrl}menu/menus`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        console.error('Erreur HTTP allergènes', res.status);
        return [];
      }
      const payload = await res.json();
    } catch (e) {
      console.error('Erreur réseau allergènes', e);
      return [];
    }
  };
  const handleCategoryClick = (id: number) => {
    props.setSelectedCategory(id);
  };

  return (
    <div className="menu">
      {props.selectedCategory === null ? (
        <div className="categories-grid">
          {mockFoodCategories.map((cat) => (
            <FoodCategory
              key={cat.id}
              id={cat.id}
              title={cat.title}
              imageUrl={cat.imageUrl}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      ) : (
        <div className="menu-grid">
          <MenuItemSelection
            listItems={getlistItems}
            table={11}
            onReturn={() => props.setSelectedCategory(null)}
          />
        </div>
      )}
    </div>
  );
}
