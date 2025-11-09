import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import './payment.scss';
import SelectItemsCheckbox from '../components/common/select-items-checkbox/select-items-checkbox.tsx';
import { ItemDetail } from '../components/payment/item-detail/item-detail.tsx';
import type { OrderItem } from '../models/OrderItem.ts';
import { SplitPaymentSummary } from '../components/payment/payment-summary/split-payment-summary.tsx';
import { NormalPaymentSummary } from '../components/payment/payment-summary/normal-payment-summary.tsx';
import { Pages, type PageType } from '../models/Pages.ts';
import { PopUp } from '../components/common/pop-up/pop-up.tsx';
import type { TableType } from '../models/Table.ts';
import { PaymentService } from '../services/payment-service.ts';
import { Category, getCategoryTitle } from '../models/Category.ts';
import { TableService } from '../services/table-service.ts';
import { useTablesContext } from '../contexts/use-tables.ts';

export type PaymentProps = {
  readonly table: TableType;
  readonly onSelectPage: (
    newPage: PageType,
    tableNumber?: number,
    preparationId?: string,
    refresh?: boolean
  ) => Promise<void>;
};

export function Payment(props: PaymentProps) {
  const { updateTable } = useTablesContext();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const loadOrderItems = async () => {
      const items = await PaymentService.getOrderItems(props.table.tableNumber);
      setOrderItems(items);
    };

    loadOrderItems().catch((error) => {
      console.error('Erreur lors de la récupération des composants de la commande:', error);
      setOrderItems([]);
    });
  }, [props.table.tableNumber]);

  const [selected, setSelected] = useState<{ [id: string]: boolean }>({});
  const [selectedQuantity, setSelectedQuantity] = useState<{ [id: string]: number }>({});

  const [isSplitEquallyMode, setIsSplitEquallyMode] = useState(false);
  const [remainingPeople, setRemainingPeople] = useState(0);
  const [totalToSplit, setTotalToSplit] = useState(0);
  const [initialPeopleCount, setInitialPeopleCount] = useState(0);

  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const baseTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amountPerPerson = initialPeopleCount > 0 ? totalToSplit / initialPeopleCount : 0;

  const total = isSplitEquallyMode ? remainingPeople * amountPerPerson : baseTotal;
  const toPay = isSplitEquallyMode
    ? amountPerPerson
    : orderItems.reduce((sum, item) => sum + item.price * (selectedQuantity[item.id] ?? 0), 0);

  function handlePay() {
    if (isSplitEquallyMode) {
      const newRemainingPeople = remainingPeople - 1;
      setRemainingPeople(newRemainingPeople);

      if (newRemainingPeople === 0) {
        setOrderItems([]);
        setIsSplitEquallyMode(false);
        setRemainingPeople(0);
        setTotalToSplit(0);
        setInitialPeopleCount(0);
        setShowPaymentSuccess(true);
      }
    } else {
      const newOrderItems = orderItems
        .map((item) => {
          const paidQty = selectedQuantity[item.id] || 0;
          if (paidQty >= item.quantity) return null;
          if (paidQty > 0) return { ...item, quantity: item.quantity - paidQty };
          return item;
        })
        .filter((item): item is OrderItem => item !== null);
      setOrderItems(newOrderItems);
      setSelected(Object.fromEntries(orderItems.map((item) => [item.id, false])));
      setSelectedQuantity(Object.fromEntries(orderItems.map((item) => [item.id, 0])));
      if (newOrderItems.length === 0) {
        setShowPaymentSuccess(true);
      }
    }
  }

  function handleSplit(divider: number) {
    const currentTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalToSplit(currentTotal);
    setInitialPeopleCount(divider);
    setIsSplitEquallyMode(true);
    setRemainingPeople(divider);
    handleSelectAll(true);
  }

  function handleSplitItem(itemId: string, divider: number) {
    const newOrderItems = orderItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, divider };
      }
      return item;
    });
    setOrderItems(newOrderItems);

    const fractionalQuantity = 1 / divider;
    setSelectedQuantity((prev) => ({
      ...prev,
      [itemId]: fractionalQuantity,
    }));
    setSelected((prev) => ({
      ...prev,
      [itemId]: true,
    }));
  }

  function handleSelectAll(checked: boolean) {
    const newSelected = Object.fromEntries(orderItems.map((item) => [item.id, checked]));
    const newSelectedQuantity = Object.fromEntries(
      orderItems.map((item) => [item.id, checked ? item.quantity : 0])
    );
    setSelected(newSelected);
    setSelectedQuantity(newSelectedQuantity);
  }

  async function handlePopUpClose() {
    setShowPaymentSuccess(false);
    await TableService.billTable(props.table.tableNumber);
    updateTable(props.table.tableNumber, {
      groupNumber: undefined,
      occupied: false,
      orderState: undefined,
      orderId: undefined,
      orderPreparationPlace: undefined,
    });
    await props.onSelectPage(Pages.Tables, undefined, undefined, true);
  }

  return (
    <div className="payment-container">
      <div className="header">
        <h1>Table {props.table.tableNumber}</h1>
        <hr className="payment-table-separator" />
        <SelectItemsCheckbox
          label="Sélectionner tout"
          disabled={isSplitEquallyMode}
          checked={orderItems.every((item) => selectedQuantity[item.id] === item.quantity)}
          onChange={handleSelectAll}
        />
      </div>
      <div className="items-container">
        {Object.values(Category)
          .filter((category) => orderItems.some((item) => item.category === category))
          .map((category) => (
            <div key={category}>
              <h2>{getCategoryTitle(category)}</h2>
              <div className="items-category-container">
                {orderItems
                  .filter((item) => item.category === category)
                  .map((item, index) => (
                    <ItemDetail
                      key={`${item.id}-${category}-${index}`}
                      name={item.shortName || item.name}
                      disabled={isSplitEquallyMode}
                      quantity={item.quantity}
                      divider={item.divider}
                      tableCapacity={props.table.capacity}
                      onSplitItem={(divider) => handleSplitItem(item.id, divider)}
                      selected={selected[item.id]}
                      selectedQuantity={selectedQuantity[item.id]}
                      onSelectChange={(checked) =>
                        handleItemSelectChange(
                          checked,
                          item.id,
                          selected,
                          setSelected,
                          setSelectedQuantity,
                          orderItems
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
            tableCapacity={props.table.capacity}
            onSplit={handleSplit}
            onPay={handlePay}
          />
        )}
      </div>
      <PopUp
        isOpen={showPaymentSuccess}
        onClose={async () => handlePopUpClose()}
        title={'Paiement terminé !'}
      >
        <p>Le paiement de la table {props.table.tableNumber} a été effectué avec succès.</p>
      </PopUp>
    </div>
  );
}

function handleItemSelectChange(
  checked: boolean,
  itemId: string,
  selected: { [id: string]: boolean },
  setSelected: Dispatch<SetStateAction<{ [id: string]: boolean }>>,
  setSelectedQuantity: Dispatch<SetStateAction<{ [id: string]: number }>>,
  orderItems: OrderItem[]
) {
  setSelected({ ...selected, [itemId]: checked });
  if (checked) {
    const item = orderItems.find((item) => item.id === itemId);
    if (item) {
      const quantityToSelect = Math.min(item.quantity, 1);
      setSelectedQuantity((prev: { [id: string]: number }) => ({
        ...prev,
        [itemId]: quantityToSelect,
      }));
    }
  } else {
    setSelectedQuantity((prev: { [id: string]: number }) => ({
      ...prev,
      [itemId]: 0,
    }));
  }
}

function handleItemQuantityChange(
  value: number,
  itemId: string,
  setSelectedQuantity: Dispatch<SetStateAction<{ [id: string]: number }>>,
  setSelected: Dispatch<SetStateAction<{ [id: string]: boolean }>>
) {
  setSelectedQuantity((prev: { [id: number]: number }) => ({ ...prev, [itemId]: value }));
  setSelected((prev: { [id: number]: boolean }) => ({ ...prev, [itemId]: value >= 1 }));
}
