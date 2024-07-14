import type { NextApiRequest, NextApiResponse } from 'next'
import { DB } from '@/db/database';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.cookies.country_session)
   return res.json({ reslut: 'not logged in' })

  const voter = await DB.instance.get_country_by_session(req.cookies.country_session)

  if (!voter)
    return res.json({ result: 'user session not found' })

  const rankings: Array<any> = req.body.rankedCandidates

  try {
    const countries = rankings.map(ranking => ranking.country)
    const assigned_points = rankings.map(ranking => ranking.points)
    const registered_candidates = await DB.instance.get_country_names()
    const largest_point = registered_candidates.length < 12 ? registered_candidates.length + +(registered_candidates.length % 2 === 1) : 12

    if (assigned_points.find(points => points > largest_point || points % 2 !== 0 || (assigned_points.indexOf(points) !== assigned_points.lastIndexOf(points))))
      return res.json({ result: 'illegal point distribution' })

    if (rankings.length !== largest_point / 2)
      return res.json({ result: `${largest_point / 2} countries must be ranked` })
    
    if (countries.find(country => !registered_candidates.includes(country) || (registered_candidates.indexOf(country) !== registered_candidates.lastIndexOf(country))))
      return res.json({ result: "invalid or duplicate candidate ranking" })
    
    await DB.instance.submit_rankings(voter.name, req.body.rankedCandidates)

    res.json({ result: 'success' })
  } catch (err: any) { res.json({ result: err.message }) }
}