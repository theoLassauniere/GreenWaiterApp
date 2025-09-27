import './App.scss';
import Tables from './components/tables/tables';
import { mockTables } from './mocks/tables';
import Sidebar from './components/sidebar/sidebar.tsx';
import MenuItem from './components/menu/MenuItem/MenuItem.tsx';
import { mockMenuItems } from './mocks/menu-items.ts';
import { useState, useEffect } from 'react';
import FoodCategory from './components/food-category/food-category.tsx';
import { mockFoodCategories } from './mocks/food-categories.ts';
import OrdersList from './components/orders-list/orders-list.tsx';
import { TableService, type TableWithOrderDto } from './services/table-service.tsx';

function App() {
  const [page, setPage] = useState<'tables' | 'menu' | 'commandes' | 'paiement'>('tables');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [tables, setTables] = useState<TableWithOrderDto[]>([]);

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
    async function seedTables() {
      try {
        let existing = await TableService.listAllTables();

        if (existing.length === 0) {
          for (const table of mockTables) {
            await TableService.addTable({ number: table.id, capacity: table.capacity });
            if (table.occupied) {
              await TableService.openTable({ tableNumber: table.id, customersCount: 2 });
            }
          }
          existing = await TableService.listAllTables();
        }

        setTables(existing);
      } catch (err) {
        console.error('Erreur init tables', err);
      }
    }

    seedTables();
  }, []);

  return (
    <div className="app">
      <div className="sidebar">
        <Sidebar onSelect={handleSelectPage} />
      </div>
      <main>
        {page === 'tables' && <Tables tables={tables} />}
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
        {page === 'commandes' && <OrdersList tables={tables} />}
        {page === 'paiement' && <h2>Paiement (à implémenter)</h2>}
      </main>
    </div>
  );
}

export default App;
