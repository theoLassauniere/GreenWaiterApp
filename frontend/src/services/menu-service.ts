import config from '../config.ts';
import { TableService } from './table-service.ts';

const baseUrl = config.bffFlag ? `${config.bffApi}/menus` : `${config.apiUrl}menu/menus`;

export type RawMenuItem = {
  _id: string;
  fullName: string;
  shortName: string;
  price: number;
  category: string;
  image: string;
};

export const MenuService = {
  async getMenuItem(id: string): Promise<RawMenuItem> {
    const url = `${baseUrl}/${id}`;
    await TableService.listAllTables();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des menus: ${response.statusText}`);
    }
    return response.json();
  },
};
