import styles from '@/app/page.module.css'
import { DB } from '@/db/database';
import "@/app/globals.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import logo from '../app/qc_logo.png';
type Props = {
    candidates: string[],
    allowEntry: boolean
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
    const { req } = context;
    const candidates: string[] = await DB.instance.get_country_names();
    let user

    if (!req.cookies.country_session || !(user = await DB.instance.get_candidate_by_session(req.cookies.country_session)))
        return { props: { candidates: [], allowEntry: false } }

    const filteredCandidates = candidates.filter(country => country !== user.country)

    /*console.log(userCountry)
    console.log(allowEntry)
    console.log(candidates)
    console.log(filteredCandidates)*/

    return { props: { candidates: filteredCandidates, allowEntry: true } };
};

export default function CountryVoting({ candidates, allowEntry }: Props) {
    const router = useRouter();

    if (!allowEntry)
        return useEffect(() => { router.push('/login') });

    const [allocatedPoints, setAllocatedPoints] = useState<number[]>(Array(candidates.length).fill(0));
    let candidateRows: JSX.Element[];

    if (candidates.length < 2) {
        candidateRows = [<div key='0' className={styles.no_candidates}>No Candidates Yet</div>];
    } else {
        const max_point = 12;
        const largest_point = Math.min(max_point, candidates.length * 2);
        const unallocatedPoints = Array.from({ length: Math.ceil(largest_point / 2) }, (_, i) => largest_point - (i * 2))
            .filter(n => !allocatedPoints.includes(n) && n > 0);
        candidateRows = candidates.map((country, i) => {
            return (
                <div key={country} className={styles.artistBox}>
                    <div style={{ marginLeft: 10 }}>{country}</div>
                    <select
                        className={styles.selectMenu}
                        style={{ marginLeft: 20 }}
                        onChange={e => {
                            const newAllocations = [...allocatedPoints];
                            newAllocations[i] = e.target.value === 'select' ? 0 : parseInt(e.target.value, 10);
                            setAllocatedPoints(newAllocations);
                        }}>
                        <option key='selected'>{allocatedPoints[i] === 0 ? 'select' : allocatedPoints[i]}</option>
                        {unallocatedPoints.map(pointVal => <option key={pointVal} value={pointVal}>{pointVal}</option>)}
                        {allocatedPoints[i] === 0 ? null : <option>select</option>}
                    </select>
                </div>
            );
        });

        candidateRows.push(
            <button key='button' className={styles.submitButton} onClick={async () => {
                const response = await fetch('/api/rank_countries', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ rankedCandidates: candidates.map((country, i) => ({ country, ranking_points: allocatedPoints[i] })).filter(ranking => ranking.ranking_points !== 0) })
                });

                const respBody = await response.json();

                if (respBody.result !== 'success')
                    alert(respBody.result);
            }}>
                Submit
            </button>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.header}>Candidate Voting</div>

            {candidateRows}
            <a href='https://quest-crusaders.de'>
                <img className={styles.logo} src={logo.src}></img>
            </a>


        </main>
    );
}
