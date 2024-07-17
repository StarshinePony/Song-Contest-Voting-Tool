import { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '@/db/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.body;
    const has_voted = await DB.instance.get_has_voted(code);

    if (has_voted !== undefined)
        res.setHeader('Set-Cookie', `loginCode=${code}; Path=/`).json({ success: true, voted: has_voted });
    else
        res.json({ success: false, message: 'Invalid code' });
}
