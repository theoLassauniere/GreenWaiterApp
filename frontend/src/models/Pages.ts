export const Pages = {
  Tables: 'tables',
  Menu: 'menu',
  Commandes: 'commandes',
  Paiement: 'paiement',
  MenuGroupe: 'group-menu',
} as const;

export type PageType = (typeof Pages)[keyof typeof Pages];
