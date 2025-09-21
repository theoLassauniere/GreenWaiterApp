import type { Item } from '../../../models/Item.ts';
import type { ReactNode } from 'react';
import { useState } from 'react';
import './MenuItem.css';
import IconButton from '../../common/IconButton/IconButton.tsx';
import AllergenPopup from '../AllergenPopup/AllergenPopup.tsx';

type MenuItemProps = {
  item: Item;
  onClick?: () => void;
};

export default function MenuItem({ item, onClick }: MenuItemProps): ReactNode {
  const { imageUrl, name, price, allergens } = item;
  const [isOpen, setOpen] = useState(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);
  return (
    <>
      <div className="menu-item" onClick={onClick}>
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
