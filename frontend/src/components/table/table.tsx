import "./table.css";
import type {TableProps} from "../../types/table";

export default function Table({
                                  id,
                                  capacity,
                                  occupied,
                                  hasBeenServed,
                                  isCommandesPage = false,
                                  commandState,
                                  commandPreparationPlace,
                              }: Readonly<TableProps>) {
    return (
        <div className={`table-card ${occupied ? "occupied" : "free"}`}>
            <h3>Table {id}</h3>
            <p>Capacité : {capacity}</p>
            <p>
                <strong>{occupied ? "Occupé" : "Libre"}</strong>
            </p>

            {isCommandesPage && (
                <div className="command-actions">
                    <button>Nouvelle commande</button>

                    {commandState !== "served" && (
                        <button>Servi</button>
                    )}
                </div>
            )}

            {hasBeenServed && (
                <button className="pay-btn">Paiement</button>
            )}

            {commandPreparationPlace && (
                <p>
                    Commande pour :{" "}
                    <strong>{commandPreparationPlace === "bar" ? "Bar" : "Kitchen"}</strong>
                </p>
            )}
        </div>
    );
}
