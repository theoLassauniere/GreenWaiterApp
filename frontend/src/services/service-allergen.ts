import data from '../assets/allergen.json';

const getAllergens = (name: string | undefined): string[] => {
  const itemAllergen = data.find((a) => a.name === name);
  return itemAllergen ? itemAllergen.allergens : [];
};

export default getAllergens;
