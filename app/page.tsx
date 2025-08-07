'use client';
import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If already signed in, go to /invites
  useEffect(() => {
    if (status === 'authenticated') router.replace('/invites');
  }, [status, router]);

  if (status === 'loading') {
    return <p className={styles.message}>Loading…</p>;
  }
  return (
    <main className={styles.container}>
      <h1>iTellU Admin</h1>
      <button className={styles.btn} onClick={() => signIn()}>
        Sign In
      </button>
    </main>
  );
}
