import Image from "next/image";
import styles from "./page.module.css";
import { VoteSubmitOverlay, VoteBtn } from "@/client/components";
import { OverlayContextProvider } from "@/client/contexts";
import { Poll } from "@/db/poll";

const CandidateRows = async () => {
  const candidates = await Poll.instance.get_artists()

  if (!candidates)
    return <div className={styles.candidate_row}>No Candidates Yet</div>

  const divs = candidates.map((candidate) => (
    <div className={styles.candidate_row}>
      <div style={{marginLeft: 10}}>{candidate.name}</div>
      <div style={{marginLeft: 10}}>{candidate.country}</div>
      <div style={{marginLeft: 10}}>{candidate.song}</div>

      <VoteBtn candidate={candidate.name}/>
    </div>
  ));

  return divs;
};

export default function Home() {
  return (
    <OverlayContextProvider>
      <VoteSubmitOverlay/>
      <main className={styles.main}>
        <div className={styles.container}>
          <CandidateRows/>
        </div>
      </main>
    </OverlayContextProvider>
  );
}
