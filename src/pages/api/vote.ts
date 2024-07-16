import { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '@/db/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  const { votes, loginCode }: { votes: string[], loginCode: string} = req.body;

  if (!loginCode)
    return res.status(400).json({ success: false, message: 'No login code found in cookies.' });

  const valid_candidates = (await DB.instance.get_artists()).map(candidate => candidate.name)

  if (votes.length !== 10 || votes.find(candidate => !candidate || votes.indexOf(candidate) !== votes.lastIndexOf(candidate)))
    return res.json({ success: false, message: 'Impoper vote amount or duplicate votes found' })

  if (votes.find(candidate => !valid_candidates.includes(candidate)))
    return res.json({ success: false, message: 'Candidate not found' })

  const remaining_votes = await DB.instance.get_remaining_votes(loginCode);

  if (!remaining_votes)
    return res.status(400).json({ success: false, message: 'No remaining votes or invalid login.' });

  votes.forEach(async candidate => await DB.instance.cast_vote(candidate))
  await DB.instance.update_remaining_votes(loginCode, 0);
  res.json({ success: true });
}
