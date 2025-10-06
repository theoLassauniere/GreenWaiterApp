import './payment-summary.scss';
import { SplitPopup } from '../split-popup/split-popup.tsx';
import { useState } from 'react';

export type PaymentBarProps = {
  readonly total: number;
  readonly toPay: number;
  readonly tableCapacity: number;
  readonly onSplit: (divider: number) => void;
  readonly onPay: () => void;
};

export function NormalPaymentSummary(props: Readonly<PaymentBarProps>) {
  const [isSplitPopupOpen, setIsSplitPopupOpen] = useState(false);

  return (
    <div className="payment-summary-container">
      <div className="payment-summary-info">
        <span className="label">Reste à payer :</span>
        <span className="amount">{props.total.toFixed(2)}€</span>
      </div>
      <div className="payment-actions">
        <button className="btn split" onClick={() => setIsSplitPopupOpen(true)}>
          Partager équitablement
        </button>
        <SplitPopup
          isOpen={isSplitPopupOpen}
          onClose={() => setIsSplitPopupOpen(false)}
          onSplit={props.onSplit}
          title={'Pour combien de personnes diviser cette addition ?'}
          splitMax={props.tableCapacity}
        />
        <button className="btn pay" onClick={props.onPay}>
          Payer : {props.toPay.toFixed(2)}€
        </button>
      </div>
    </div>
  );
}
