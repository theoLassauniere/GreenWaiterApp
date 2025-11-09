import type { Item } from '../../../models/Item.ts';
import React, { useState } from 'react';
import './menu-item.scss';
import AllergenPopup from '../allergen-popup/allergen-popup.tsx';

type MenuItemProps = {
  item: Item;
  onClick?: () => void;
  className?: string;
};

export default function MenuItem({ item, onClick, className }: Readonly<MenuItemProps>) {
  const { imageUrl, name, price } = item;
  const [isOpen, setIsOpen] = useState(false);

  const open = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <>
      <div className={`menu-item ${className ?? ''}`} onClick={onClick}>
        <div className="info-button" onClick={open}>
          <span>i</span>
        </div>
        <div className="item-img-container">
          <img className="item-img" src={imageUrl ?? ''} alt={name} />
        </div>
        <div className="item-text-container">
          <div>
            {name} - <strong>{price}€</strong>
          </div>
        </div>
      </div>
      <AllergenPopup
        isOpen={isOpen}
        onClose={close}
        allergens={item.allergens}
        title={`Liste d'allergènes pour : ${
          name.length > 20
            ? item.shortName && item.shortName.trim() !== ''
              ? item.shortName
              : name
            : name
        }`}
      />
    </>
  );
}
