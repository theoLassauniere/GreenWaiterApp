import './App.scss';
import Tables from "./components/tables/tables";
import { mockTables } from "./mocks/tables";
import Sidebar from "./components/sidebar/sidebar.tsx";
import MenuItem from './components/menu/MenuItem/MenuItem.tsx';
import type { Item } from './models/Item.ts';

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
            <div className="sidebar">
                <Sidebar/>
            </div>
            <main>
                <div className="tables">
                    <Tables tables={mockTables} />
                </div>
                <div className="item">
                  <MenuItem item={item} />
                </div>
            </main>
        </div>
    );
}

export default App;
