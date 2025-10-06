export const Pages = {
  Tables: 'tables',
  Menu: 'menu',
  Commandes: 'commandes',
  Paiement: 'paiement',
} as const;

export type PageType = (typeof Pages)[keyof typeof Pages];
