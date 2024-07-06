'use client'

import { useRouter } from 'next/navigation';
import styles from '../app/page.module.css';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { OverlayContext } from './contexts';

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
        alert(response.status);
    }}/>
  )
}


type CandidateDetails = {
  type: string,
  i1: string
  i2: string,
  i3: string,
}

export function AddCandidateBtn(details: CandidateDetails) {
  return (
    <button onClick={() => {
      
    }}
    >Add {details.type}
    </button>
  )
}

export function ToggleCandidateTypeBtn({ current_type, set_candidate, set_input_type, set_ph1, set_ph2, set_ph3 }: {
  current_type: string,
  set_candidate: Dispatch<SetStateAction<string>>,
  set_input_type: Dispatch<SetStateAction<string>>,
  set_ph1: Dispatch<SetStateAction<string>>,
  set_ph2: Dispatch<SetStateAction<string>>,
  set_ph3: Dispatch<SetStateAction<string>>
}) {
  const new_values = current_type === "Artist" ? {
    candidate_type: "Country",
    input_type: "password",
    ph1: "name",
    ph2: "password",
    ph3: "re-enter password"
  } : {
    candidate_type: "Artist",
    input_type: "text",
    ph1: "name",
    ph2: "country",
    ph3: "song"
  }

  return (
    <button onClick={() => {
      set_candidate(new_values.candidate_type);
      set_input_type(new_values.input_type);
      set_ph1(new_values.ph1);
      set_ph2(new_values.ph2);
      set_ph3(new_values.ph3);
    }}>
      Change Type
    </button>
  )
}