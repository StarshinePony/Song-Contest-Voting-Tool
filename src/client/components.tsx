'use client'

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