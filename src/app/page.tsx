import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          Bronyvision Songcontest<br />Galacon 2024 Edition<br />Voting
        </div>
        <div className={styles.navBtns}>
          <Link href="public_login" passHref>
            <button>User Voting</button>
          </Link>
          <Link href="login" passHref>
            <button>Country Voting</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
