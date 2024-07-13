import type { NextApiRequest, NextApiResponse } from 'next'
import { DB } from '@/db/database';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = req.socket.remoteAddress;
  if (ip === undefined) return;

  const rankings: Array<any> = req.body.rankedCandidates
  if (rankings.length > 11)
    return res.json({ result: 'too many rankings'})

  try {
    const countries = rankings.map(ranking => ranking.country)
    const assigned_points = rankings.map(ranking => ranking.points)

    //              12 - 11 10 9 etc.                                                                                                        duplicate points
    if (assigned_points.includes(rankings.length - 1) || assigned_points.find(points => points > rankings.length || (assigned_points.indexOf(points) !== assigned_points.lastIndexOf(points))))
      return res.json({ result: 'illegal point distribution' })

    const registered_candidates = await DB.instance.get_country_names()

    if (rankings.length !== Math.min(11, registered_candidates.length - 1))
      return res.json({ result: `${registered_candidates.length - 1} countries must be ranked` })
    
    if (countries.find(country => !registered_candidates.includes(country) || (registered_candidates.indexOf(country) !== registered_candidates.lastIndexOf(country))))
      return res.json({ result: "invalid or duplicate candidate ranking" })
    
    await DB.instance.submit_rankings(ip, req.body.rankedCandidates)

    res.json({ result: 'success' })
  } catch (err: any) { res.json({ result: err.message }) }
}