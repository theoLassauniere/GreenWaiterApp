export const OrderState = {
  PreparingInKitchen: 'preparing-in-kitchen',
  AwaitingService: 'awaiting-service',
  Served: 'served',
} as const;

export type OrderState = (typeof OrderState)[keyof typeof OrderState];
