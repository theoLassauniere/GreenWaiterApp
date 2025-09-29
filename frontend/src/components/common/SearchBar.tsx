import IconButton from './IconButton/IconButton.tsx';
import { useEffect, useRef, useState } from 'react';
import './SearchBar.scss';

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  clearable?: boolean;
  onClear?: () => void;
  className?: string;
  handleSearch?: () => void;
};

export default function SearchBar(props: SearchBarProps) {
  const { placeholder, value: propValue, onChange, clearable = true, onClear } = props;
  const [value, setValue] = useState(propValue ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (propValue !== undefined) {
      setValue(propValue);
    }
  }, [propValue]);

  const clear = () => {
    setValue('');
    onClear?.();
    onChange?.('');
    inputRef.current?.focus();
  };

  return (
    <div className={`SearchBarContainer ${props.className ?? ''}`}>
      <input
        ref={inputRef}
        type="text"
        className="SearchBar"
        placeholder={placeholder ?? 'Search...'}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
      />
      {clearable && value && <IconButton onClick={clear} icon={'close'} />}
      <IconButton onClick={props.handleSearch} icon={'search'} />
    </div>
  );
}
