import { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '@/db/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.body;

    const login = await DB.instance.check_login(code);

    if (login) {
        res.json({ success: true, votes: login.votes });
    } else {
        res.json({ success: false, message: 'Invalid code' });
    }
}
