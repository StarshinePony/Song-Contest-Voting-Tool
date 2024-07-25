import styles from "./page.module.css";
import React from 'react';
import Link from "next/link";
import logo from './images/logo.webp';
import qc_logo from './images/qc_logo.webp'
import { log } from "console";
export default function Home() {
  console.log(logo);
  return (
    <div className={styles.main}>
      <img className={styles.logo} src={logo.src} alt="Logo"></img>
      <div className={styles.container}>
        <div className={styles.header}>
          Voting
        </div>
        <div className={styles.navBtns}>
          <Link href="public_login" passHref>
            <button>Vote!</button>
          </Link>
          <Link href="login" passHref>
            <button>Country Login</button>
          </Link>
        </div>
      </div>
      <a href='https://quest-crusaders.de'>
        <img className={styles.logo} src={qc_logo.src}></img>
      </a>

    </div>
  );
}
