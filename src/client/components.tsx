'use client'

import { useRouter } from 'next/navigation';
import { useContext } from "react";
import styles from '@/app/page.module.css'
import { OverlayContext } from "./contexts";

export function VoteSubmitOverlay() {
    const ctx = useContext(OverlayContext)

    return (
        <div id={styles.ty_screen} style={{top: ctx.top}}>
            <div>Thank You For Voting!</div>
            <button onClick={() => ctx.setTop('-100%')}>
                Change Vote
            </button>
        </div>
    );
};


export function VoteBtn({ candidate }: { candidate: string }) {
  const overlayCtx = useContext(OverlayContext)

  return (
    <button className={styles.vote_btn} onClick={async () => {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: candidate,
      });
      
      if ((await response.json()).result !== "success") {
        alert("Error While Voting D:")
        return
      }

      overlayCtx.setTop('0')
    }}>
    Vote
    </button>
  );
}


export function LoginBtn({ uname, pass }: { uname: string, pass: string }) {
  const router = useRouter()

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

      if ((await response.json()).result === 'success')
        router.push('/admin_panel')
      else
        alert("Invalid Credentials");
    }}/>
  )
}