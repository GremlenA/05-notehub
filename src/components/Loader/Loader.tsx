
import React from 'react';
import css from './Loader.module.css';

const Loader: React.FC = () => (
  <div className={css.loaderWrapper}>
    <div className={css.loader} />
    <div>Loading...</div>
  </div>
);

export default Loader;
