'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {sanitize} from '@/utils/sanitize';
import { Invite } from '@/types/invite';

import FilterControls from './components/FilterControls';
import SearchBox from './components/SearchBox';
import InviteTable from './components/InviteTable';
import Pagination from './components/Pagination';

import styles from './invites.module.css';
import useDebounce from '../hooks/useDebounce';
const STATUS_OPTIONS = ['all', 'pending', 'accepted', 'rejected'] as const;
const API = process.env.NEXT_PUBLIC_API_URL!;
const PAGE_SIZE = 10;

export default function InvitesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [invites, setInvites] = useState<Invite[]>([]);
  const [filter, setFilter] = useState<typeof STATUS_OPTIONS[number]>('all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formatter for dates
  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    []
  );

  // Redirect unauthenticated users back to home
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  // Fetch invites once we're authenticated
  useEffect(() => {
    if (status !== 'authenticated') {
      setInvites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${API}/invites${filter !== 'all' ? `?status=${filter}` : ''}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Invite[]>;
      })
      .then(setInvites)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status, filter]);

  // Apply search & filter
  const filtered = useMemo(() => {
    const q = sanitize(debouncedSearch).toLowerCase();
    return invites.filter((inv) => {
      if (filter !== 'all' && inv.status !== filter) return false;
      return (
        inv.teacher.name.toLowerCase().includes(q) ||
        inv.student.name.toLowerCase().includes(q)
      );
    });
  }, [invites, filter, debouncedSearch]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // While loading auth state
  if (status === 'loading') {
    return (
      <main className={styles.container}>
        <p className={styles.message}>Loading session…</p>
      </main>
    );
  }

  // Main render
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Lesson Invites</h2>
        <button
          className={styles.signout}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign Out
        </button>
      </header>

      <FilterControls
        options={STATUS_OPTIONS}
        value={filter}
        onChange={(v) => { setFilter(v); setPage(1); }}
      />

      <SearchBox
        value={search}
        onChange={(v) => { setSearch(v); setPage(1); }}
        placeholder="Search teacher or student…"
      />

      {loading && <p className={styles.message}>Loading…</p>}
      {error && (
        <p className={`${styles.message} ${styles.error}`}>Error: {error}</p>
      )}

      {!loading && !error && (
        <>
          <InviteTable data={pageData} dateFormatter={dateFmt} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </main>
  );
}
