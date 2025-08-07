'use client';
import { useState, useEffect, useMemo } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FilterControls from './components/FilterControls';
import SearchBox from './components/SearchBox';
import InviteTable from './components/InviteTable';
import Pagination from './components/Pagination';
import styles from './invites.module.css';
import { sanitize } from '@/utils/sanitize';
import { Invite } from '@/types/invite';

const STATUS_OPTIONS = ['all', 'pending', 'accepted', 'rejected'] as const;
const API = process.env.NEXT_PUBLIC_API_URL!;
const PAGE_SIZE = 10;


export default function InvitesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [invites, setInvites] = useState<Invite[]>([]);
  const [filter, setFilter] = useState<typeof STATUS_OPTIONS[number]>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date formatter
  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    []
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/');
  }, [status, router]);

  // Fetch invites once authenticated
  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    setError(null);
    fetch(`${API}/invites${filter !== 'all' ? `?status=${filter}` : ''}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setInvites)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status, filter]);

  // Filter + sanitize search
  const filtered = useMemo(() => {
    const q = sanitize(search).toLowerCase();
    return invites.filter((inv) => {
      if (filter !== 'all' && inv.status !== filter) return false;
      return (
        inv.teacher.name.toLowerCase().includes(q) ||
        inv.student.name.toLowerCase().includes(q)
      );
    });
  }, [invites, filter, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
