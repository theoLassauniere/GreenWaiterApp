import './select-items-checkbox.scss';

type SelectItemsCheckboxProps = {
  readonly label: string;
  readonly checked: boolean;
  readonly disabled: boolean;
  readonly onChange: (checked: boolean) => void;
};

export default function SelectItemsCheckbox({
  label,
  checked,
  disabled,
  onChange,
}: Readonly<SelectItemsCheckboxProps>) {
  return (
    <div className="select-items-checkbox">
      <label>
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
      </label>
    </div>
  );
}
