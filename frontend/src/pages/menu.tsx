import { mockFoodCategories } from '../mocks/food-categories.ts';
import FoodCategory from '../components/menu/food-category/food-category.tsx';
import MenuItemSelection from '../components/menu/menu-item-selection/menu-item-selection.tsx';
import { mockMenuItems } from '../mocks/menu-items.ts';

export type MenuProps = {
  selectedCategory: number | null;
  setSelectedCategory: (cat: number | null) => void;
};

export function Menu(props: Readonly<MenuProps>) {
  const handleCategoryClick = (id: number) => {
    props.setSelectedCategory(id);
  };

  return (
    <>
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
            listItems={mockMenuItems}
            onReturn={() => props.setSelectedCategory(null)}
          />
        </div>
      )}
    </>
  );
}
