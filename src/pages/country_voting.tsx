import styles from '@/app/page.module.css'
import { DB } from '@/db/database';
import "@/app/globals.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Credentials from '@/credentials';
type Props = {
    candidates: string[],
    allowEntry: boolean
};
export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
    const candidates: string[] = await DB.instance.get_country_names();
    const { req } = context;
    const allowEntry: boolean = !!req.cookies.country_session && await Credentials.country_session_check(req.cookies.country_session);
    const userSession = req.cookies.country_session
    let userCountry: string | undefined = undefined
    if (userSession) {
        const country = await DB.instance.get_country_by_session(userSession)
        userCountry = country?.name
    }
    /*console.log(userCountry)
    console.log(allowEntry)
    console.log(candidates)*/

    const filteredCandidates = userCountry ? candidates.filter(country => country !== userCountry) : candidates;
    //console.log(filteredCandidates)

    return { props: { candidates: filteredCandidates, allowEntry } };
};

export default function CountryVoting({ candidates, allowEntry }: Props) {
    const router = useRouter();

    useEffect(() => {
        if (!allowEntry) {
            router.push('/login');
        }
    }, [allowEntry, router]);

    const [allocatedPoints, setAllocatedPoints] = useState<number[]>(Array(candidates.length).fill(0));
    let candidateRows: JSX.Element[];

    if (candidates.length < 2) {
        candidateRows = [<div key='0' className={styles.no_candidates}>No Candidates Yet</div>];
    } else {
        const largest_point = candidates.length + 1 < 12 ? candidates.length + 1 + +((candidates.length + 1) % 2 !== 0) : 12
        const unallocatedPoints = Array.from({ length: largest_point / 2 }, (_, i) => largest_point - (i * 2))
            .filter(n => !allocatedPoints.includes(n));

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

                if (respBody.result !== 'success') {
                    alert(respBody.result);
                }
            }}>
                Submit
            </button>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                {candidateRows}
            </div>
        </main>
    );
}
