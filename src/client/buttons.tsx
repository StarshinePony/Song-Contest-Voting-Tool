'use client'

import { redirect } from 'next/dist/server/api-utils';
import styles from '../app/page.module.css'

export function VoteBtn({ candidate }: { candidate: string }) {
  return (
    <button className={styles.vote_btn} onClick={async () => {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: candidate,
      });
      
      const tyScreen = document.getElementById(styles.ty_screen)

      if (!tyScreen) return console.error("tyScreen not found")
      tyScreen.style.top = '0'
    }}>
    Vote
    </button>
  );
}

export function LoginBtn({ uname, pass }: { uname: string, pass: string }) {
  return (
    <button onClick={async () => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // ABSOLUTELY NOT SECURE
        // TODO: Look into Diffie-Hellman key exchange or certificates or some other encryption method
        body: JSON.stringify({ uname, pass }),
      });

      if ((await response.json()).result === "idk lol")
        alert("successful login")
      else
        alert(response.status);
    }}/>
  )
}

export function ChangeVoteBtn() {
  return (
    <button onClick={() => {
      const tyScreen = document.getElementById(styles.ty_screen)

      if (!tyScreen) return console.error("tyScreen not found")
      tyScreen.style.top = '-100%'
    }}>
      Change Vote
    </button>
  )
}