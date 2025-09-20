export const PreparationPlace = {
    Cuisine: "cuisine",
    Bar: "bar",
} as const;

export type PreparationPlace = typeof PreparationPlace[keyof typeof PreparationPlace];
