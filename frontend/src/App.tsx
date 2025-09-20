import "./App.css";
import Table from "./components/table/table";

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
        </div>
    );
}

export default App;
