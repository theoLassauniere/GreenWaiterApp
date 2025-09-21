import './App.css';
import Table from './components/table/table';
import MenuItem from './components/menu/MenuItem/MenuItem.tsx';
import type { Item } from './model/Item.ts';

const item: Item = {
  id: 1,
  name: 'Item 1',
  description: 'This is item 1',
  price: 10.0,
  imageUrl: 'src/assets/coca-33cl.jpg',
  allergens: ['gluten', 'nuts'],
};
function App() {
  return (
    <div className="app">
      <h1>Nom du restaurant</h1>
      <div className="tables">
        <Table
          id={1}
          capacity={4}
          occupied={true}
          isCommandesPage={true}
          commandState="preparing-in-kitchen"
          commandPreparationPlace="bar"
        />
        <Table id={2} capacity={2} occupied={false} isCommandesPage={false} />
        <Table
          id={3}
          capacity={2}
          occupied={true}
          isCommandesPage={true}
          commandState="awaiting-service"
          commandPreparationPlace="bar"
        />
        <Table
          id={4}
          capacity={6}
          occupied={true}
          isCommandesPage={true}
          commandState="served"
          commandPreparationPlace="cuisine"
        />
      </div>

      <div className="item">
        <MenuItem item={item} />
      </div>
    </div>
  );
}

export default App;
