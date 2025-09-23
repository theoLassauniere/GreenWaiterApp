import './App.scss';
import Tables from './components/tables/tables';
import { mockTables } from './mocks/tables';
import Sidebar from './components/sidebar/sidebar.tsx';
import MenuItem from './components/menu/MenuItem/MenuItem.tsx';
import { mockMenuItems } from './mocks/menu-items.ts';
import { useState } from 'react';
import FoodCategory from './components/food-category/food-category.tsx';
import { mockFoodCategories } from './mocks/food-categories.ts';
import OrdersList from './components/orders-list/orders-list.tsx';

function App() {
  const [page, setPage] = useState<'tables' | 'menu' | 'commandes' | 'paiement'>('tables');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const handleSelectPage = (newPage: typeof page) => {
    setPage(newPage);
    if (newPage === 'menu') {
      setSelectedCategory(null);
    }
  };
  const handleCategoryClick = (id: number) => {
    setSelectedCategory(id);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <Sidebar onSelect={handleSelectPage} />
      </div>
      <main>
        {page === 'tables' && <Tables tables={mockTables} />}
        {page === 'menu' && (
          <>
            {selectedCategory === null ? (
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
                {mockMenuItems
                  .filter((item) => item.categoryId === selectedCategory)
                  .map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
              </div>
            )}
          </>
        )}
        {page === 'commandes' && <OrdersList tables={mockTables} />}
        {page === 'paiement' && <h2>Paiement (à implémenter)</h2>}
      </main>
    </div>
  );
}

export default App;
