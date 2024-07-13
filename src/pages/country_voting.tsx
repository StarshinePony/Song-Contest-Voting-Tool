import styles from '@/app/page.module.css'
import { DB } from '@/db/database';
import "@/app/globals.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import Credentials from '@/credentials';

export const getServerSideProps = (async (context: GetServerSidePropsContext) => {
  const candidates: string[] = await DB.instance.get_country_names()

  const { req } = context
  const allowEntry: boolean = !!req.cookies.country_session && await Credentials.country_session_check(req.cookies.country_session)
  return { props: { candidates, allowEntry } }
})

export default function CountryVoting({ candidates, allowEntry }: { candidates: string[], allowEntry: boolean }) {
  const router = useRouter()

  if (!allowEntry)
    return useEffect(() => {router.push('/login')})

  const [allocatedPoints, setAllocatedPoints] = useState<number[]>(Array(candidates.length).fill(0));
  let candidate_rows

  if (candidates.length < 2)
    candidate_rows = [<div key='0' className={styles.no_candidates}>No Candidates Yet</div>];
  
  else {

    const unallocated_points = Array.from({length: Math.min(12, candidates.length)}, (_, i) => candidates.length - i)
      .filter(n => !allocatedPoints.includes(n));

    unallocated_points.splice(1, 1)

    candidate_rows = candidates.map((country, i) => {
      return (
        <div key={country} className={styles.candidate_row}>
          <div style={{marginLeft: 10}}>{country}</div>

          <select
            style={{marginLeft: 20}}
            onChange={e => {
              const newAllocations = [...allocatedPoints]
              newAllocations[i] = e.target.value === 'select' ? 0 : parseInt(e.target.value)

              setAllocatedPoints(newAllocations)
            }}>
            <option key='selected'>{allocatedPoints[i] === 0 ? 'select' : allocatedPoints[i]}</option>
            {unallocated_points.map(point_val => <option key={point_val} value={point_val}>{point_val}</option>)}
            {allocatedPoints[i] === 0 ? null : <option>select</option>}
          </select>
        </div>
      )
    })

    candidate_rows.push(
      <button key='button' style={{padding: 10}} onClick={async () => {
        const response = await fetch('/api/rank_countries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rankedCandidates: candidates.map((country, i) => ({country, ranking: allocatedPoints[i]})).filter(ranking => ranking.ranking !== 0)})
        })

        const resp_body = await response.json()

        if (resp_body.result !== 'success')
          alert(resp_body.result)
      }}>
        Submit
      </button>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {candidate_rows}
      </div>
    </main>
  );
}
