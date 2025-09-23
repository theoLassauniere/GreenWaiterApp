import { ItemDetail } from '../components/item-detail/ItemDetail.tsx';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { mockCommandItems } from '../mocks/command-items.ts';
import { mockFoodCategories } from '../mocks/food-categories.ts';
import SelectItemsCheckbox from '../components/select-items-checkbox/select-items-checkbox.tsx';

export type PaymentProps = {
  readonly tableNumber: number;
};

export function Payment(props: PaymentProps) {
  const initialSelected = Object.fromEntries(mockCommandItems.map((item) => [item.id, false]));
  const initialSelectedQuantity = Object.fromEntries(mockCommandItems.map((item) => [item.id, 0]));
  const [selected, setSelected] = useState<{ [id: number]: boolean }>(initialSelected);
  const [selectedQuantity, setSelectedQuantity] = useState<{ [id: number]: number }>(
    initialSelectedQuantity
  );

  const handleSelectAll = (checked: boolean) => {
    const newSelected = Object.fromEntries(mockCommandItems.map((item) => [item.id, checked]));
    const newSelectedQuantity = Object.fromEntries(
      mockCommandItems.map((item) => [item.id, checked ? 1 : 0])
    );
    setSelected(newSelected);
    setSelectedQuantity(newSelectedQuantity);
  };

  function handleItemSelectChange(
    checked: boolean,
    itemId: number,
    selected: { [id: number]: boolean },
    setSelected: Dispatch<SetStateAction<{ [id: number]: boolean }>>,
    setSelectedQuantity: Dispatch<SetStateAction<{ [id: number]: number }>>
  ) {
    setSelected({ ...selected, [itemId]: checked });
    setSelectedQuantity((prev: { [id: number]: number }) => ({
      ...prev,
      [itemId]: checked ? 1 : 0,
    }));
  }

  function handleItemQuantityChange(
    value: number,
    itemId: number,
    setSelectedQuantity: Dispatch<SetStateAction<{ [id: number]: number }>>,
    setSelected: Dispatch<SetStateAction<{ [id: number]: boolean }>>
  ) {
    setSelectedQuantity((prev: { [id: number]: number }) => ({ ...prev, [itemId]: value }));
    setSelected((prev: { [id: number]: boolean }) => ({ ...prev, [itemId]: value >= 1 }));
  }

  return (
    <>
      <h1>Table {props.tableNumber}</h1>
      <SelectItemsCheckbox
        label="Sélectionner tout"
        checked={Object.values(selected).every(Boolean)}
        onChange={handleSelectAll}
      />
      {mockFoodCategories.map((category) => (
        <div key={category.id}>
          <h2>{category.title}</h2>
          {mockCommandItems
            .filter((item) => item.category == category.title)
            .map((item) => (
              <ItemDetail
                key={item.id}
                name={item.name}
                quantity={item.quantity}
                selected={selected[item.id]}
                selectedQuantity={selectedQuantity[item.id]}
                onSelectChange={(checked) =>
                  handleItemSelectChange(
                    checked,
                    item.id,
                    selected,
                    setSelected,
                    setSelectedQuantity
                  )
                }
                onQuantityChange={(value) =>
                  handleItemQuantityChange(value, item.id, setSelectedQuantity, setSelected)
                }
              />
            ))}
        </div>
      ))}
    </>
  );
}
