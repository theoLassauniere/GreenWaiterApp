export const PreparationPlace = {
    Kitchen: "kitchen",
    Bar: "bar",
} as const;

export type PreparationPlace = typeof PreparationPlace[keyof typeof PreparationPlace];
