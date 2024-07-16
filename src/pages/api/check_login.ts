import { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '@/db/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.body;
    const remaining_votes = await DB.instance.get_remaining_votes(code);

    if (remaining_votes !== undefined)
        res.json({ success: true, votes: remaining_votes });
    else
        res.json({ success: false, message: 'Invalid code' });
}
