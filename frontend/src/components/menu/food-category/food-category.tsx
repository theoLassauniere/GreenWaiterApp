import './food-category.scss';
import type Category from '../../../models/Category.ts';

type FoodCategoryProps = {
  id: Category;
  title: string;
  imageUrl: string;
  onClick: (id: string) => void;
};

export default function FoodCategory({
  id,
  title,
  imageUrl,
  onClick,
}: Readonly<FoodCategoryProps>) {
  return (
    <button
      type="button"
      className="food-category-card"
      style={{ backgroundImage: `url(${imageUrl})` }}
      onClick={() => onClick(id)}
    >
      <div className="food-category-overlay">
        <h3>{title}</h3>
      </div>
    </button>
  );
}
