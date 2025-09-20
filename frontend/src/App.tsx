import './App.css';
import type { Item } from './model/Item.ts';
import MenuItem from './components/menu/MenuItem.tsx';
import './components/menu/MenuItem.css';

function App() {
  const item: Item = {
    id: 1,
    name: 'Item 1',
    description: 'This is item 1',
    price: 10.0,
    imageUrl: 'src/assets/coca-33cl.jpg',
    allergens: ['gluten', 'nuts'],
  };

  return (
    <>
      <div>
        <MenuItem item={item} onClick={() => console.log(`clicked on ${item.name}`)} />
      </div>
    </>
  );
}

export default App;
