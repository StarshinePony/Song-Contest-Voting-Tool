import type { NextApiRequest, NextApiResponse } from 'next'
import { DB } from '@/db/database';
 
type ResponseData = {
  result?: string,
}
 
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const ip = req.socket.remoteAddress;
  if (ip === undefined) return;

  if (req.body === "REMOVE")
    await DB.instance.remove_vote(ip)
  else
    await DB.instance.cast_vote(ip, req.body)

  res.json({ result: 'success' })
}