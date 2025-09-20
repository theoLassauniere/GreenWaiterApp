import { type TableProps } from "../components/table/table";

export const mockTables: readonly TableProps[] = [
    {
        id: 1,
        capacity: 4,
        occupied: true,
        isCommandesPage: true,
        commandState: "preparing-in-kitchen",
        commandPreparationPlace: "bar",
    },
    {
        id: 2,
        capacity: 2,
        occupied: false,
        isCommandesPage: false,
    },
    {
        id: 3,
        capacity: 2,
        occupied: true,
        isCommandesPage: true,
        commandState: "awaiting-service",
        commandPreparationPlace: "bar",
    },
    {
        id: 4,
        capacity: 6,
        occupied: true,
        isCommandesPage: true,
        commandState: "served",
        commandPreparationPlace: "cuisine",
    },
    {
        id: 5,
        capacity: 8,
        occupied: false,
        isCommandesPage: false,
    },
    {
        id: 6,
        capacity: 4,
        occupied: false,
        isCommandesPage: false,
    },
    {
        id: 7,
        capacity: 4,
        occupied: true,
        isCommandesPage: true,
        commandState: "awaiting-service",
        commandPreparationPlace: "bar",
    },
    {
        id: 8,
        capacity: 6,
        occupied: false,
        isCommandesPage: false,
    },
];
