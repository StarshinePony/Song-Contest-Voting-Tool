import adminHandler from '@/admin_handler';
import { DB } from '@/db/database'
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const added = await DB.instance.add_musician_candidate(
    req.body.musicianName,
    req.body.musicianCountry,
    req.body.musicianSong
  );

  res.json({ result: added ? "Candidate Added" : "Candidate Already Present" })
}

export default adminHandler(handler)
