import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import styles from '@/app/page.module.css';
import type { Artist } from '@/db/database';
import { DB } from '@/db/database';
import '@/app/globals.css';
import { GetServerSidePropsContext } from 'next';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const candidates: Artist[] = await DB.instance.get_artists();
  const { req } = context
  
  if (!req.cookies.loginCode)
    return { props: { candidates, allowEntry: false, hasVoted: false }}
  
  const remaining_votes = await DB.instance.get_remaining_votes(req.cookies.loginCode)

  // in case of manually created cookie
  if (remaining_votes === undefined)
    return { props: { candidates, allowEntry: false, hasVoted: false }}

  return { props: { candidates, allowEntry: true, hasVoted: remaining_votes === 0 } };
};

export default function MusicianVoting({ candidates, allowEntry, hasVoted }: { candidates: Artist[], allowEntry: boolean, hasVoted: boolean }) {
  const router = useRouter();
  const [votes, setVotes] = useState<string[]>([])
  const [canVote, setCanVote] = useState(!hasVoted)

  if (!allowEntry)
    return useEffect(() => { router.push('/public_login') });

  if (hasVoted && votes.length !== 10)
    setVotes(Array(10))

  return (
    <main className={styles.main}>
      <div style={{ position: 'fixed', top:'5px', left: '5px' }}>Votes left: {10 - votes.length}</div>
      <div className={styles.container}>
        {candidates.map(candidate => (
          <div key={candidate.name} className={styles.artistBox}>
            <div className={styles.artistInfo}>
              <div className={styles.artistName}>{candidate.name}</div>
              <div className={styles.artistCountry}>{candidate.country}</div>
              <div className={styles.artistSong}>{candidate.song}</div>
              {canVote && (
                <button
                className={styles.vote_btn}
                onClick={() => {
                  const new_votes = [...votes]
                  const i = votes.indexOf(candidate.name)

                  if (i !== -1)
                    new_votes.splice(i, 1)
                  else
                    new_votes.push(candidate.name)

                  setVotes(new_votes)
                }}>
                  Vote
                  {votes.includes(candidate.name) && <img src='/check_mark.png' style={{width:'12px', height:'12px', marginLeft:'5px'}} />}
                </button>
              )}
            </div>
          </div>
        ))}
        {candidates.length === 0 && (
          <div className={styles.no_candidates}>No Candidates Yet</div>
        )}
        {canVote && (
        <button onClick={async () => {
          const loginCode = Cookies.get('loginCode');
      
          const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ votes, loginCode }),
          });
      
          const result = await response.json();
          alert(result.status === 400 ? 'Thanks for Voting! You have used all your votes.' : 'Error while voting');
          setCanVote(false)
        }}>
          Submit
        </button>
      )}
      </div>
    </main>
  );
}
