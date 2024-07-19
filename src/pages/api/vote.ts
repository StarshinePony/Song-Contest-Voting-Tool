import { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '@/db/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST')
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });

  const { votes, loginCode }: { votes: { candidate_name: string, votes: number}[], loginCode: string} = req.body;

  if (!loginCode)
    return res.status(400).json({ success: false, message: 'Not logged in' });

  const valid_candidates = (await DB.instance.get_candidates()).map(candidate => candidate.name)
  
  if (votes.reduce((sum, candidate) => sum + candidate.votes, 0) !== 10 || votes.find((vote, i) => votes.findLastIndex(last => last.candidate_name === vote.candidate_name) !== i))
    return res.json({ success: false, message: 'Impoper vote amount or duplicate votes found' })

  if (votes.find(vote => !valid_candidates.includes(vote.candidate_name)))
    return res.json({ success: false, message: 'Candidate not found' })

  const has_voted = await DB.instance.get_has_voted(loginCode);

  if (has_voted)
    return res.status(400).json({ success: false, message: 'Already voted or invalid login.' });

  votes.forEach(async ({ candidate_name, votes }) => await DB.instance.cast_vote(candidate_name, votes))
  await DB.instance.set_voted(loginCode);
  res.json({ success: true });
}
