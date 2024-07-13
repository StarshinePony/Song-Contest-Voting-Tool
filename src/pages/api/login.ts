import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';
import Credentials from '@/credentials';
import { DB } from '@/db/database';
function hash(data: string): string {
    return createHash('sha512').update(data).digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (await Credentials.country_login_check(req.body.uname, req.body.pass)) {
        const session_id = hash(req.body.uname + hash(req.body.pass));
        const userCountry = await DB.instance.get_country(req.body.uname);
        await Credentials.create_session(req.body.uname, session_id);
        console.log(userCountry?.name)
        res.setHeader('Set-Cookie', `country_session=${session_id}; country_name=${userCountry?.name}; Path=/; HttpOnly`).json({ result: 'success' });
    } else {
        res.json({ result: "invalid credentials" });
    }
}