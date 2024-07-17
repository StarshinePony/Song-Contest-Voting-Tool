import type { NextApiRequest, NextApiResponse } from 'next';
import { createHash } from 'crypto';
import Credentials from '@/credentials';

function hash(data: string): string {
    return createHash('sha512').update(data).digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const country_candidate = await Credentials.country_login_check(req.body.uname, req.body.pass)

    if (!country_candidate)
        return res.json({ result: "invalid credentials" })

    const session_id = hash(req.body.uname + hash(req.body.pass));
    await Credentials.create_session(req.body.uname, session_id);
    res.setHeader('Set-Cookie', `country_session=${session_id}; country_name=${country_candidate.country}; Path=/; HttpOnly`).json({ result: 'success' });
}