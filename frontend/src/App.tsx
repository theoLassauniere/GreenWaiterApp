import './App.scss';
import Tables from "./components/tables/tables";
import { mockTables } from "./mocks/tables";
import Sidebar from "./components/sidebar/sidebar.tsx";
import MenuItemSelection from './pages/MenuItemSelection.tsx';
import mockData from './components/mockData.ts';
import { useState } from "react";


function App() {
    const [page, setPage] = useState<"tables" | "menu" | "commandes" | "paiement">("tables");

    return (
        <div className="app">
            <div className="sidebar">
                <Sidebar onSelect={setPage} />
            </div>
            <main>
                {page === "tables" && <Tables tables={mockTables} />}
                {page === "menu" && (
                    <div className="menu-grid">
                      <MenuItemSelection listItems={mockData} />
                    </div>
                )}
                {page === "commandes" && <h2>Commandes (à implémenter)</h2>}
                {page === "paiement" && <h2>Paiement (à implémenter)</h2>}
            </main>
        </div>
    );
}

export default App;
