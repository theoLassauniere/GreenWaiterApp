import type { Item } from '../../../models/Item.ts';
import React, { useEffect, useState } from 'react';
import './menu-item.scss';
import IconButton from '../../common/icon-button/icon-button.tsx';
import AllergenPopup from '../allergen-popup/allergen-popup.tsx';
import getAllergens from '../../../services/service-allergen.ts';

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
