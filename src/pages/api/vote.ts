import { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '@/db/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  const { votes, loginCode }: { votes: string[], loginCode: string} = req.body;

  if (!loginCode)
    return res.status(400).json({ success: false, message: 'Not logged in' });

  const valid_candidates = (await DB.instance.get_candidates()).map(candidate => candidate.name)

  if (votes.length !== 10 || votes.find(candidate => !candidate || votes.indexOf(candidate) !== votes.lastIndexOf(candidate)))
    return res.json({ success: false, message: 'Impoper vote amount or duplicate votes found' })

  if (votes.find(candidate => !valid_candidates.includes(candidate)))
    return res.json({ success: false, message: 'Candidate not found' })

  const has_voted = await DB.instance.get_has_voted(loginCode);

  if (has_voted)
    return res.status(400).json({ success: false, message: 'Already voted or invalid login.' });

  votes.forEach(async candidate => await DB.instance.cast_vote(candidate))
  await DB.instance.set_voted(loginCode);
  res.json({ success: true });
}
