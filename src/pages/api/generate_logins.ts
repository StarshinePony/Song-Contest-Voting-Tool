import type { NextApiRequest, NextApiResponse } from 'next'
import { DB } from '@/db/database';
import { randomBytes, randomInt } from 'crypto';
import { stringify } from 'csv-stringify/sync';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { numAccounts } = req.body;
    const logins = [];

    for (let i = 0; i < numAccounts; i++) {
        const password = randomInt(3).toString();
        const votes = 10;
        await DB.instance.create_login(password, votes);
        logins.push({ password, votes });
    }

    const csv = stringify(logins, { header: true });
    res.json({ csv });
}
