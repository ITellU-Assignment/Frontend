'use client';
import React from 'react';
import styles from '../invites.module.css';

export default function Pagination(props: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className={styles.pagination}>
      <button
        onClick={() => props.onPageChange(props.page - 1)}
        disabled={props.page === 1}
      >
        Prev
      </button>
      <span>
        Page {props.page} of {props.totalPages}
      </span>
      <button
        onClick={() => props.onPageChange(props.page + 1)}
        disabled={props.page === props.totalPages}
      >
        Next
      </button>
    </div>
  );
}
