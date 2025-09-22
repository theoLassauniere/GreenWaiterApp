import './App.scss';
import Tables from "./components/tables/tables";
import { mockTables } from "./mocks/tables";
import Sidebar from "./components/sidebar/sidebar.tsx";
import MenuItem from './components/menu/MenuItem/MenuItem.tsx';
import type { Item } from './models/Item.ts';
import { mockMenuItems } from "./mocks/menu-items.ts";
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
                        {mockMenuItems.map((item: Item) => (
                            <MenuItem key={item.id} item={item} />
                        ))}
                    </div>
                )}
                {page === "commandes" && <h2>Commandes (à implémenter)</h2>}
                {page === "paiement" && <h2>Paiement (à implémenter)</h2>}
            </main>
        </div>
    );
}

export default App;
