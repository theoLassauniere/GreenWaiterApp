import './occupied-tables-checkbox.css';

type OccupiedTablesCheckboxProps = {
  readonly showOccupied: boolean;
  readonly onChange: (checked: boolean) => void;
};

export default function OccupiedTablesCheckbox({
  showOccupied,
  onChange,
}: Readonly<OccupiedTablesCheckboxProps>) {
  return (
    <div className="occupied-tables-checkbox">
      <label>
        <input
          type="checkbox"
          checked={showOccupied}
          onChange={(e) => onChange(e.target.checked)}
        />
        Afficher seulement les tables occupées
      </label>
    </div>
  );
}
