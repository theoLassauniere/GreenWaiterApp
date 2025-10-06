import config from '../config.ts';
import data from '../assets/allergen.json';

const getAllergens = async (id: string): Promise<string[]> =>
  config.bffFlag ? await getAllergensBff(id) : getAllergensNoBff(id);

const getAllergensBff = async (id: string): Promise<string[]> => {
  try {
    const res = await fetch(`${config.bffApi}allergen/getAllergen/${id}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      console.error('Erreur HTTP allergènes', res.status);
      return [];
    }
    const payload = await res.json();
    return Array.isArray(payload) ? payload : (payload?.allergens ?? []);
  } catch (e) {
    console.error('Erreur réseau allergènes', e);
    return [];
  }
};

const getAllergensNoBff = (id: string): string[] => {
  const itemAllergen = data.find((a) => a._id === id);
  return itemAllergen ? itemAllergen.allergens : [];
};

export default getAllergens;
