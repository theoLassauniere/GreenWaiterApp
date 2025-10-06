import { type Dispatch, type SetStateAction, useState } from 'react';
import './payment.scss';
import { mockCommandItems } from '../mocks/command-items.ts';
import { mockFoodCategories } from '../models/food-categories.ts';
import SelectItemsCheckbox from '../components/common/select-items-checkbox/select-items-checkbox.tsx';
import { ItemDetail } from '../components/payment/item-detail/item-detail.tsx';
import type { CommandItem } from '../models/CommandItem.ts';
import { SplitPaymentSummary } from '../components/payment/payment-summary/split-payment-summary.tsx';
import { NormalPaymentSummary } from '../components/payment/payment-summary/normal-payment-summary.tsx';

export type PaymentProps = {
  readonly tableNumber: number;
  readonly tableCapacity: number;
};

export function Payment(props: PaymentProps) {
  const [commandItems, setCommandItems] = useState([...mockCommandItems]);

  const initialSelected = Object.fromEntries(commandItems.map((item) => [item.id, false]));
  const initialSelectedQuantity = Object.fromEntries(commandItems.map((item) => [item.id, 0]));
  const [selected, setSelected] = useState<{ [id: number]: boolean }>(initialSelected);
  const [selectedQuantity, setSelectedQuantity] = useState<{ [id: number]: number }>(
    initialSelectedQuantity
  );

  const [isSplitEquallyMode, setIsSplitEquallyMode] = useState(false);
  const [remainingPeople, setRemainingPeople] = useState(0);
  const [totalToSplit, setTotalToSplit] = useState(0);
  const [initialPeopleCount, setInitialPeopleCount] = useState(0);

  const baseTotal = commandItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amountPerPerson = initialPeopleCount > 0 ? totalToSplit / initialPeopleCount : 0;

  const total = isSplitEquallyMode ? remainingPeople * amountPerPerson : baseTotal;
  const toPay = isSplitEquallyMode
    ? amountPerPerson
    : commandItems.reduce((sum, item) => sum + item.price * selectedQuantity[item.id], 0);

  function handlePay() {
    if (isSplitEquallyMode) {
      const newRemainingPeople = remainingPeople - 1;
      setRemainingPeople(newRemainingPeople);

      if (newRemainingPeople === 0) {
        setCommandItems([]);
        setIsSplitEquallyMode(false);
        setRemainingPeople(0);
        setTotalToSplit(0);
        setInitialPeopleCount(0);
      }
    } else {
      setCommandItems((prev) =>
        prev
          .map((item) => {
            const paidQty = selectedQuantity[item.id] || 0;
            if (paidQty >= item.quantity) return null;
            if (paidQty > 0) return { ...item, quantity: item.quantity - paidQty };
            return item;
          })
          .filter((item): item is CommandItem => item !== null)
      );
      setSelected(Object.fromEntries(commandItems.map((item) => [item.id, false])));
      setSelectedQuantity(Object.fromEntries(commandItems.map((item) => [item.id, 0])));
    }
  }

  function handleSplit(divider: number) {
    const currentTotal = commandItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalToSplit(currentTotal);
    setInitialPeopleCount(divider);
    setIsSplitEquallyMode(true);
    setRemainingPeople(divider);
    handleSelectAll(true);
  }

  function handleSelectAll(checked: boolean) {
    const newSelected = Object.fromEntries(commandItems.map((item) => [item.id, checked]));
    const newSelectedQuantity = Object.fromEntries(
      commandItems.map((item) => [item.id, checked ? item.quantity : 0])
    );
    setSelected(newSelected);
    setSelectedQuantity(newSelectedQuantity);
  }

  return (
    <div className="payment-container">
      <div className="header">
        <h1>Table {props.tableNumber}</h1>
        <hr className="payment-table-separator" />
        <SelectItemsCheckbox
          label="Sélectionner tout"
          disabled={isSplitEquallyMode}
          checked={commandItems.every((item) => selectedQuantity[item.id] === item.quantity)}
          onChange={handleSelectAll}
        />
      </div>
      <div className="items-container">
        {mockFoodCategories
          .filter((category) => commandItems.some((item) => item.categoryId === category.id))
          .map((category) => (
            <div key={category.id}>
              <h2>{category.title}</h2>
              <div className="items-category-container">
                {commandItems
                  .filter((item) => item.categoryId === category.id)
                  .map((item) => (
                    <ItemDetail
                      key={item.id}
                      name={item.name}
                      disabled={isSplitEquallyMode}
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
            </div>
          ))}
      </div>
      <div className="payment-summary-fixed">
        <hr className="payment-summary-separator" />
        {isSplitEquallyMode ? (
          <SplitPaymentSummary
            total={total}
            amountPerPerson={toPay}
            remainingPeople={remainingPeople}
            onPay={handlePay}
          />
        ) : (
          <NormalPaymentSummary
            total={total}
            toPay={toPay}
            tableCapacity={props.tableCapacity}
            onSplit={handleSplit}
            onPay={handlePay}
          />
        )}
      </div>
    </div>
  );
}

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
