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
            <p>{occupied ? "Occupé" : "Libre"}</p>

            {hasBeenServed && (
                <button className="pay-btn">Paiement</button>
            )}

            {isCommandesPage && (
                <div className="command-actions">
                    <button>Nouvelle commande</button>

                    {commandState !== "served" && (
                        <button>Servi</button>
                    )}

                    {commandPreparationPlace && (
                        <p>
                            Commande pour :{" "}
                            <strong>{commandPreparationPlace === "bar" ? "Bar" : "Kitchen"}</strong>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
