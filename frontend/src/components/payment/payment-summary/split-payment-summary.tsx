import './payment-summary.scss';

export type SplitPaymentSummaryProps = {
  readonly total: number;
  readonly amountPerPerson: number;
  readonly remainingPeople: number;
  readonly onPay: () => void;
};

export function SplitPaymentSummary(props: Readonly<SplitPaymentSummaryProps>) {
  return (
    <div className="payment-summary-container">
      <div className="payment-summary-info">
        <span className="label">Reste à payer :</span>
        <span className="amount">{props.total.toFixed(2)}€</span>
        <span className="label">Paiements restants :</span>
        <span className="amount">{props.remainingPeople}</span>
      </div>
      <div className="payment-actions">
        <button className="btn pay" onClick={props.onPay}>
          Payer : {props.amountPerPerson.toFixed(2)}€
        </button>
      </div>
    </div>
  );
}
