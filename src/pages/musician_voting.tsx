import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import styles from '@/app/page.module.css';
import { DB } from '@/db/database';
import '@/app/globals.css';
import { GetServerSidePropsContext } from 'next';
import logo from '../app/images/qc_logo.webp';
import { link } from 'fs';
type CandidatePublicInfo = {
  name: string,
  country: string,
  song: string
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req } = context
  const candidates: CandidatePublicInfo[] = (await DB.instance.get_candidates())
    .map(candidate => ({ name: candidate.name, country: candidate.country, song: candidate.song }));

  if (!req.cookies.loginCode)
    return { props: { candidates, allowEntry: false, hasVoted: false } }

  const has_voted = await DB.instance.get_has_voted(req.cookies.loginCode)

  return { props: { candidates, allowEntry: has_voted !== undefined, hasVoted: !!has_voted } }
};

export default function MusicianVoting({ candidates, allowEntry, hasVoted }: { candidates: CandidatePublicInfo[], allowEntry: boolean, hasVoted: boolean }) {
  const router = useRouter();
  const [canVote, setCanVote] = useState(!hasVoted)
  const [votes, setVotes] = useState<{ candidate_name: string, votes: number }[]>(
    candidates.map(candidate => ({ candidate_name: candidate.name, votes: 0 }))
  )

  if (!allowEntry)
    return useEffect(() => { router.push('/public_login') });

  const remaining_votes = canVote ? 10 - votes.reduce((sum, candidate) => sum + candidate.votes, 0) : 0

  return (
    <main className={styles.main}>
      <div style={{ position: 'fixed', top: '5px', fontFamily: 'Arial Black', color: 'white', fontSize: '2rem' }}>Votes left: {remaining_votes}</div>
      {candidates.map((candidate, i) => (
        <div key={candidate.name} className={styles.artistBox}>
          <div className={styles.artistInfo}>
            <div className={styles.artistName}>{candidate.name}</div>
            <div className={styles.artistCountry}>Country: {candidate.country}</div>
            <div className={styles.artistSong}>Song: {candidate.song}</div>
            {canVote && (
              <div className={styles.vote_btns}>
                <button onClick={() => {
                  if (votes[i].votes <= 0)
                    return

                  const new_votes = [...votes]
                  --new_votes[i].votes
                  setVotes(new_votes)
                }}>-</button>
                {votes[i].votes > 0 ? votes[i].votes : 'Vote'}
                <button onClick={() => {
                  if (remaining_votes <= 0)
                    return

                  const new_votes = [...votes]
                  ++new_votes[i].votes
                  setVotes(new_votes)
                }}>+</button>
              </div>
            )}
            {canVote && (
              <div className={styles.vote_btns}>
                <button onClick={() => {
                  const new_votes = [...votes]
                  new_votes[i].votes = 0
                  setVotes(new_votes)
                }}>X</button>
              </div>

            )}
            <div className={styles.del_btns}>
            </div>
          </div>
        </div>
      ))}
      {candidates.length === 0 && (
        <div className={styles.no_candidates}>No Candidates Yet</div>
      )}
      {canVote && (
        <button className={styles.submitButton} onClick={async () => {
          const loginCode = Cookies.get('loginCode');

          const response = await fetch('/api/vote', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ votes: votes.filter(vote => vote.votes !== 0), loginCode }),
          });

          const result = await response.json();

          if (!result.success)
            return alert(`Error: ${result.message}`);

          alert('Thanks for Voting! You have used all your votes')

          setCanVote(false)
          router.push('https://quest-crusaders.de');


        }}>
          Submit
        </button>
      )}
      <a href='https://quest-crusaders.de'>
        <img className={styles.logo} src={logo.src}></img>
      </a>

    </main>
  );
}
