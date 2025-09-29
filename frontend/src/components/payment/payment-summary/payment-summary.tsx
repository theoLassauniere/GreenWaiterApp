import './payment-summary.scss';

export type PaymentBarProps = {
  readonly total: number;
  readonly toPay: number;
  readonly onSplit: () => void;
  readonly onPay: () => void;
};

export function PaymentSummary(props: Readonly<PaymentBarProps>) {
  return (
    <div className="payment-summary-container">
      <div className="payment-summary-info">
        <span className="label">Reste à payer :</span>
        <span className="amount">{props.total.toFixed(2)}€</span>
      </div>
      <div className="payment-actions">
        <button className="btn split" onClick={props.onSplit}>
          Partager équitablement
        </button>
        <button className="btn pay" onClick={props.onPay}>
          Payer : {props.toPay.toFixed(2)}€
        </button>
      </div>
    </div>
  );
}
