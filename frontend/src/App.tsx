import "./App.css";
import Table from "./components/table/table";

function App() {
    return (
        <div className="app">
            <h1>Mes Tables</h1>
            <div className="tables">
                <Table
                    id={1}
                    capacity={4}
                    occupied={true}
                    hasBeenServed={false}
                    isCommandesPage={true}
                    commandState="pending"
                    commandPreparationPlace="bar"
                />
                <Table
                    id={2}
                    capacity={2}
                    occupied={false}
                    hasBeenServed={false}
                    isCommandesPage={false}
                />
                <Table
                    id={3}
                    capacity={6}
                    occupied={true}
                    hasBeenServed={true}
                    isCommandesPage={true}
                    commandState="served"
                    commandPreparationPlace="kitchen"
                />
            </div>
        </div>
    );
}

export default App;
