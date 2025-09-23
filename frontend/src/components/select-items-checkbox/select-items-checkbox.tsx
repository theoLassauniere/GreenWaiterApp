import './select-items-checkbox.css';

type SelectItemsCheckboxProps = {
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
};

export default function SelectItemsCheckbox({
  label,
  checked,
  onChange,
}: Readonly<SelectItemsCheckboxProps>) {
  return (
    <div className="select-items-checkbox">
      <label>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    </div>
  );
}
