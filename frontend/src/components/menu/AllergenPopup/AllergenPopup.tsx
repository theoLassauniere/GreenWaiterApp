import { PopUp } from '../../common/pop-up/pop-up.tsx';
import './AllergenPopup.scss';

type AllergenPopupProps = {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  allergens?: string[];
  className?: string;
};

export default function AllergenPopup(props: AllergenPopupProps) {
  const { title = 'Allergènes', isOpen, onClose, allergens = [], className = '' } = props;
  return (
    <PopUp isOpen={isOpen} onClose={onClose} title={title} className={className}>
      <ul className="allergen-list">
        {allergens.length > 0 ? (
          allergens.map((allergen, index) => (
            <li key={`${allergen}-${index}`} className="allergen-item">
              {allergen}
            </li>
          ))
        ) : (
          <li>Aucun allergène trouvé</li>
        )}
      </ul>
    </PopUp>
  );
}
