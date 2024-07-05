import Image from "next/image";
import styles from "./page.module.css";
import { VoteButton } from "../client/buttons";

type Candidate = {
  name: string
  file_name: string
}

const candidates: Array<Candidate> = [
  {
    name: "Big Mac",
    file_name: "big_mac"
  },
  {
    name: "Fluttershy",
    file_name: "fluttershy"
  },
  {
    name: "Pipp Petals",
    file_name: "pipp_petals"
  },
  {
    name: "Rarity",
    file_name: "rarity"
  },
  {
    name: "Ruby Jubilee",
    file_name: "ruby_jubilee"
  },
  {
    name: "Saphire Shores",
    file_name: "saphire_shores"
  }
]

const CandidateRows = ({ candidates }: { candidates: Array<Candidate> }) => {
  const divs = candidates.map((candidate, index) => (
    <div key={index} className={styles.candidate_row}>
      <Image
        className={styles.artist_img}
        src={`/${candidate.file_name}.jpg`}
        alt={candidate.name} width={90}
        height={90}
      />

      <div className={styles.artist_name}>
        {candidate.name}
      </div>

      <VoteButton candidate={candidate.name}/>
    </div>
  ));

  return divs;
};

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
          <CandidateRows candidates={candidates}/>
      </div>
    </main>
  );
}
