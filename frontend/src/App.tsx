import './App.scss';
import Tables from './components/tables/tables';
import { mockTables } from './mocks/tables';
import Sidebar from './components/sidebar/sidebar.tsx';
import { useEffect, useState } from 'react';
import FoodCategory from './components/food-category/food-category.tsx';
import { mockFoodCategories } from './mocks/food-categories.ts';
import { mockMenuItems } from './mocks/menu-items.ts';
import ReadyNotification from './components/ready-notification/ready-notification.tsx';
import OrdersList from './components/orders-list/orders-list.tsx';
import { Payment } from './pages/payment.tsx';
import MenuItemSelection from './pages/MenuItemSelection.tsx';

function App() {
  const [page, setPage] = useState<'tables' | 'menu' | 'commandes' | 'paiement'>('tables');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [readyNotification, setNotification] = useState<string | null>(null);
  const handleSelectPage = (newPage: typeof page) => {
    setPage(newPage);
    if (newPage === 'menu') {
      setSelectedCategory(null);
    }
  };
  const handleCategoryClick = (id: number) => {
    setSelectedCategory(id);
  };

  useEffect(() => {
    setNotification('Table 3 est prête à être servie !');
  }, []);

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
                <MenuItemSelection listItems={mockMenuItems} />
              </div>
            )}
          </>
        )}
        {page === 'commandes' && <OrdersList tables={mockTables} />}
        {page === 'paiement' && <Payment tableNumber={12} />}
      </main>
      {readyNotification && (
        <ReadyNotification message={readyNotification} onClose={() => setNotification(null)} />
      )}
    </div>
  );
}

export default App;
