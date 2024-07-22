import styles from "./page.module.css";
import React from 'react';
import Link from "next/link";
import logo from './logo.png';
import qc_logo from './qc_logo.png'
import { log } from "console";
export default function Home() {
  console.log(logo);
  return (
    <div className={styles.main}>
      <img className={styles.logo} src={logo.src} alt="Logo"></img>
      <div className={styles.container}>
        <div className={styles.header}>
          Bronyvision Songcontest<br />Galacon 2024 Edition<br />Voting
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
      <img className={styles.logo} src={qc_logo.src}></img>
    </div>
  );
}
