import './menu.scss';
import { mockFoodCategories } from '../models/food-categories.ts';
import FoodCategory from '../components/menu/food-category/food-category.tsx';
import MenuItemSelection from '../components/menu/menu-item-selection/menu-item-selection.tsx';
import { forwardRef, useImperativeHandle, useState } from 'react';
import type { Category } from '../models/Category.ts';
import type { Item } from '../models/Item.ts';
import type { CommandItem } from '../models/CommandItem.ts';
import { OrderService, type ShortOrderDto } from '../services/order-service.ts';
import config from '../config.ts';
import { Pages, type PageType } from '../models/Pages.ts';
import MenuItemBottomBar from '../components/menu/bottom-bar/menu-item-bottom-bar.tsx';
import { MenuService } from '../services/menu-service.ts';

export interface MenuProps {
  tableId?: number;
  onSelectPage: (page: PageType, tableNumber?: number) => void;
}

export interface MenuHandle {
  onReturn: () => void;
}

export const Menu = forwardRef<MenuHandle, MenuProps>(function Menu(
  { tableId, onSelectPage },
  ref
) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [listItems, setListItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<CommandItem[]>([]);
  const [loading, setLoading] = useState(false);

  const onReturn = () => {
    setSelectedCategory(null);
    setListItems([]);
  };

  useImperativeHandle(ref, () => ({
    onReturn,
  }));

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const items = await MenuService.getListItems(category);
      setListItems(items);
    } catch (e) {
      console.error(e);
      setListItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (item: Item) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveItem = (item: CommandItem) => {
    setSelectedItems((prev) =>
      prev
        .map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleSendOrder = async () => {
    if (!tableId) {
      console.warn('Aucune table sélectionnée, mode consultation. Pas de commande envoyée.');
      return;
    }

    if (selectedItems.length === 0) return;

    const preparation: ShortOrderDto = {
      tableNumber: tableId,
      menuItems: selectedItems.map((item) => ({
        menuItemId: item.id,
        menuItemShortName: item.shortName,
        howMany: item.quantity,
      })),
    };

    try {
      const preparations = config.bffFlag
        ? await OrderService.createNewOrderBFF(preparation)
        : await OrderService.createNewOrderNoBFF(preparation);

      setSelectedItems([]);
      setSelectedCategory(null);
      setListItems([]);
      onSelectPage(Pages.Tables, tableId);

      console.log('Commande créée avec succès :', preparations);
    } catch (e) {
      console.error('Erreur lors de l’envoi de la commande :', e);
    }
  };

  return (
    <>
      {selectedCategory === null ? (
        <div className="categories-grid">
          {mockFoodCategories.map((cat) => (
            <FoodCategory
              key={cat.category}
              id={cat.category}
              title={cat.title}
              imageUrl={cat.imageUrl}
              onClick={() => handleCategoryClick(cat.category)}
            />
          ))}
        </div>
      ) : (
        <div className="menu-grid">
          <MenuItemSelection
            listItems={listItems}
            table={tableId}
            listSelectedItems={selectedItems}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onSend={handleSendOrder}
            onReturn={onReturn}
            loading={loading}
          />
        </div>
      )}
      {tableId && (
        <MenuItemBottomBar
          tableNumber={tableId}
          items={selectedItems}
          onSend={handleSendOrder}
          onClick={handleAddItem}
          onRemoveItem={handleRemoveItem}
        />
      )}
    </>
  );
});
