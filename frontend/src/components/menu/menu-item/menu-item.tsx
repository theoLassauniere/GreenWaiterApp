import type { Item } from '../../../models/Item.ts';
import * as React from 'react';
import { type ReactNode, useState } from 'react';
import './menu-item.scss';
import IconButton from '../../common/icon-button/icon-button.tsx';
import AllergenPopup from '../allergen-popup/allergen-popup.tsx';

type MenuItemProps = {
  item: Item;
  onClick?: () => void;
  className?: string;
};

export default function MenuItem({ item, onClick, className }: Readonly<MenuItemProps>): ReactNode {
  const { imageUrl, name, price, allergens } = item;
  const [isOpen, setIsOpen] = useState(false);
  const open = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
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
