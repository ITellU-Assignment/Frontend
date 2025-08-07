'use client';
import React from 'react';
import styles from '../invites.module.css';

export default function FilterControls<T extends string>(props: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className={styles.controls}>
      {props.options.map((opt) => (
        <button
          key={opt}
          className={`${styles.btn} ${props.value === opt ? styles.active : ''}`}
          onClick={() => props.onChange(opt)}
        >
          {opt[0].toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  );
}
