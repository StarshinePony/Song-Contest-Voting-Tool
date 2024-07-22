import adminHandler from '@/admin_handler';
import { DB } from '@/db/database'
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const added = await DB.instance.remove_candidate(
        req.body.candidateName
    );

    res.json({ result: added ? "Candidate Removed" : "Candidate not Present" })
}

export default adminHandler(handler)