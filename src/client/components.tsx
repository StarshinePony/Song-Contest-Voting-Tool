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
      <button onClick={() => {
        ctx.setTop('-100%')
        fetch('/api/vote', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: 'REMOVE'
        })
      }}>
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


export function LoginBtn({ api_route, page_route, uname, pass }: { api_route: string, page_route: string, uname: string, pass: string }) {
  const router = useRouter()

  return (
    <button onClick={async () => {
      const response = await fetch(`/api/${api_route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uname, pass }),
      });

      if ((await response.json()).result === 'success')
        router.push(`/${page_route}`)
      else
        alert("Invalid Credentials");
    }}/>
  )
}

export function NavBtn({ route, text }: { route: string, text: string }) {
  const router = useRouter()

  return (
    <button onClick={() =>
      router.push(`/${route}`)
    }>
      {text}
    </button>
  )
}