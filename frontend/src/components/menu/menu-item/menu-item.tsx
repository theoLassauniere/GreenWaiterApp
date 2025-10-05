import type { Item } from '../../../models/Item.ts';
import React, { useEffect, useState } from 'react';
import './menu-item.scss';
import IconButton from '../../common/icon-button/icon-button.tsx';
import AllergenPopup from '../allergen-popup/allergen-popup.tsx';
import config from '../../../config';
import data from '../../../assets/allergen.json';

type MenuItemProps = {
  item: Item;
  onClick?: () => void;
  className?: string;
};

export default function MenuItem({ item, onClick, className }: Readonly<MenuItemProps>) {
  const { imageUrl, name, price } = item;
  const [isOpen, setIsOpen] = useState(false);
  const [allergens, setAllergens] = useState<string[]>([]);

  const open = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  // ça pourrait être chargé au moment de la creation des items, pour l'instant ça n'a pas été fait mais au moment de la recup des items il faudra le faire
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      const list = await getAllergens(item.id);
      if (mounted) setAllergens(list);
    })();
    return () => {
      mounted = false;
    };
  }, [item.id]);

  return (
    <>
      <div className={`menu-item ${className ?? ''}`} onClick={onClick}>
        <IconButton className="icon-button-menu-item" icon="info" onClick={open} />
        <div className="item-img-container">
          <img className="item-img" src={imageUrl ?? ''} alt={name} />
        </div>
        <div className="item-text-container">
          <div>
            {name} - {price}€
          </div>
        </div>
      </div>
      <AllergenPopup
        isOpen={isOpen}
        onClose={close}
        allergens={allergens}
        title={`Allergènes - ${name}`}
      />
    </>
  );
}
