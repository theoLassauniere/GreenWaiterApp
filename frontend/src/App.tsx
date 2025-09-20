import './App.scss';
import Tables from "./components/tables/tables";
import { mockTables } from "./mocks/tables";
import Sidebar from "./components/sidebar/sidebar.tsx";
import MenuItemSelection from './pages/MenuItemSelection.tsx';
import mockData from './components/mockData.ts';

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
                  <MenuItemSelection listItems={mockData} />
                </div>
            </main>
        </div>
    );
}

export default App;
