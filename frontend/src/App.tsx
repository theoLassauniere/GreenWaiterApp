import "./App.css";
import Tables from "./components/tables/tables";
import { mockTables } from "./mocks/tables";

function App() {
    return (
        <div className="app">
            <h1>Nom du restaurant</h1>
            <Tables tables={mockTables} />
        </div>
    );
}

export default App;
