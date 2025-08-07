// InviteTable.tsx
import React from 'react';
import styles from '../invites.module.css';
import { Invite } from '@/types/invite';

export default function InviteTable(props: {
  data: Invite[];
  dateFormatter: Intl.DateTimeFormat;
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Teacher</th>
          <th>Student</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map((inv) => (
          <tr key={inv.id}>
            <td data-label="Teacher">{inv.teacher.name}</td>
            <td data-label="Student">{inv.student.name}</td>
            <td data-label="Date">
              {props.dateFormatter.format(new Date(inv.scheduledAt))}
            </td>
            <td data-label="Status" className={styles[inv.status]}>
              {inv.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
