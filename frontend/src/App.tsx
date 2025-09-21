import './App.scss';
import Table from './components/table/table';
import MenuItemSelection from './pages/MenuItemSelection.tsx';
import mockData from './components/mockData.ts';
import Sidebar from "./components/sidebar/sidebar.tsx";

function App() {
    return (
        <div className="app">
            <div className="sidebar">
                <Sidebar/>
            </div>
            <main>
                <div className="tables">
                    <h1>Nom du restaurant</h1>
                    <Table
                        id={1}
                        capacity={4}
                        occupied={true}
                        isCommandesPage={true}
                        commandState="preparing-in-kitchen"
                        commandPreparationPlace="bar"
                    />
                    <Table
                        id={2}
                        capacity={2}
                        occupied={false}
                        isCommandesPage={false}
                    />
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
                  <MenuItemSelection listItems={mockData} />
                </div>
            </main>
        </div>
    );
}

export default App;
