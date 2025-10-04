import { useState } from 'react';
import { PopUp } from '../../common/pop-up/pop-up.tsx';

import './split-popup.scss';

export type SplitPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onSplit: (divider: number) => void;
  readonly title: string;
  readonly splitMax: number;
};

export function SplitPopup(props: Readonly<SplitPopupProps>) {
  const [sliderValue, setSliderValue] = useState(1);

  const sliderWidth = 100;
  const labelOffset = 8;
  const tooltipPosition =
    labelOffset + ((sliderValue - 1) / (props.splitMax - 1)) * (sliderWidth - 2 * labelOffset);

  return (
    <PopUp isOpen={props.isOpen} onClose={props.onClose} title={props.title}>
      <div className="slider-container">
        <span className="min-label">1</span>
        <input
          type="range"
          min={1}
          max={props.splitMax}
          value={sliderValue}
          step={1}
          onChange={(e) => {
            const value = Number(e.target.value);
            setSliderValue(value);
          }}
        />
        <span className="max-label">{props.splitMax}</span>
        <div className="slider-tooltip" style={{ left: `${tooltipPosition}%` }}>
          {sliderValue}
        </div>
      </div>
      <div className="split-popup-actions">
        <button
          className="btn"
          onClick={() => {
            props.onSplit(sliderValue);
            props.onClose();
          }}
        >
          Diviser en {sliderValue}
        </button>
      </div>
    </PopUp>
  );
}
