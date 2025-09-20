export const CommandState = {
    Pending: "pending",
    InProgress: "in-progress",
    Served: "served",
} as const;

export type CommandState = typeof CommandState[keyof typeof CommandState];
