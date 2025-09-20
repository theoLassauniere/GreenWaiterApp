export const CommandState = {
    PreparingInKitchen: "preparing-in-kitchen",
    AwaitingService: "awaiting-service",
    Served: "served",
} as const;

export type CommandState = typeof CommandState[keyof typeof CommandState];
