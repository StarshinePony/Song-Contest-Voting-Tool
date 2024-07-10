import styles from '@/app/page.module.css'
import { VoteBtn, VoteSubmitOverlay } from "@/client/components";
import { OverlayContextProvider } from "@/client/contexts";
import type { Artist } from '@/db/database';
import { DB } from '@/db/database';
import "@/app/globals.css";

export const getServerSideProps = (async () => {
  const candidates: Artist[] | undefined = await DB.instance.get_artists()
  return { props: { candidates } }
})

export default function MusicianVoting({ candidates }: { candidates: Artist[] | undefined }) {
  let candidate_rows

  if (!candidates?.length)
    candidate_rows = [<div key='0' className={styles.no_candidates}>No Candidates Yet</div>]

  else candidate_rows = candidates.map((candidate) => (
    <div key={candidate.name} className={styles.candidate_row}>
      <div style={{marginLeft: 10}}>{candidate.name}</div>
      <div style={{marginLeft: 10}}>{candidate.country}</div>
      <div style={{marginLeft: 10}}>{candidate.song}</div>

      <VoteBtn candidate={candidate.name}/>
    </div>
  ));

  return (
    <OverlayContextProvider>
      <VoteSubmitOverlay/>
      <main className={styles.main}>
        <div className={styles.container}>
          { candidate_rows }
        </div>
      </main>
    </OverlayContextProvider>
  );
}