import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import styles from '@/app/page.module.css';
import { VoteBtn } from '@/client/components';
import { OverlayContextProvider } from '@/client/contexts';
import type { Artist } from '@/db/database';
import { DB } from '@/db/database';
import '@/app/globals.css';

export const getServerSideProps = async () => {
  const candidates: Artist[] | undefined = await DB.instance.get_artists();
  return { props: { candidates } };
};

export default function MusicianVoting({ candidates }: { candidates: Artist[] | undefined }) {
  const router = useRouter();
  const [remainingVotes, setRemainingVotes] = useState<number | null>(null);

  useEffect(() => {
    const loginCode = Cookies.get('loginCode');
    const votes = Cookies.get('remainingVotes');
    if (!loginCode || !votes) {
      router.push('/public_login');
    } else {
      setRemainingVotes(parseInt(votes, 10));
    }
  }, []);

  const handleVote = async (candidate: string) => {
    const loginCode = Cookies.get('loginCode');
    if (!loginCode) {
      router.push('/public_login');
      return;
    }

    const response = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candidate, loginCode }),
    });

    const result = await response.json();
    if (result.success) {
      setRemainingVotes(result.remainingVotes);
      Cookies.set('remainingVotes', result.remainingVotes.toString());
    } else {
      if (result.status === 400) {
        alert('Thanks for Voting! You have used all your votes.');
      } else {
        alert('Error while voting.');
      }
    }
  };

  return (
    <OverlayContextProvider>
      <main className={styles.main}>
        <div className={styles.container}>
          {candidates?.map((candidate) => (
            <div key={candidate.name} className={styles.artistBox}>
              <div className={styles.artistInfo}>
                <div className={styles.artistName}>{candidate.name}</div>
                <div className={styles.artistCountry}>{candidate.country}</div>
                <div className={styles.artistSong}>{candidate.song}</div>
                <VoteBtn candidate={candidate.name} onVote={handleVote} />
              </div>
            </div>
          ))}
          {candidates && candidates.length === 0 && (
            <div className={styles.no_candidates}>No Candidates Yet</div>
          )}
        </div>
      </main>
    </OverlayContextProvider>
  );
}
