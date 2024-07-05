import type { NextApiRequest, NextApiResponse } from 'next'
import { Poll } from '@/db/poll';
 
type ResponseData = {
  message?: string,
}
 
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    await Poll.instance.dbReady;

    const ip = req.socket.remoteAddress;
    if (ip === undefined) return;

    await Poll.instance.cast_vote(ip, req.body)
    console.log(`${ip} voted for ${req.body}`)
    res.status(200).json({ message: 'Vote Successful' })
}