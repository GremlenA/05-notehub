// src/components/SearchBox/SearchBox.tsx
import React from 'react';
import css from './SearchBox.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const SearchBox: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search notes"
    />
  );
};

export default SearchBox;
