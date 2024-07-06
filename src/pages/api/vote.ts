import type { NextApiRequest, NextApiResponse } from 'next'
import { Poll } from '@/db/poll';
 
type ResponseData = {
  result?: string,
}
 
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const ip = req.socket.remoteAddress;
  if (ip === undefined) return;

  await Poll.instance.cast_vote(ip, req.body)
  console.log(`${ip} voted for ${req.body}`)
  res.json({ result: 'success' })
}