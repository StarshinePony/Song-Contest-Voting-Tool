import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'crypto';
import Credentials from '@/credentials';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // TODO: could probably just merge admin_login and login endpoints into a single one
    if (await Credentials.country_login_check(req.body.uname, req.body.pass)) {
        // TODO: not properly implemented. session id should ideally use
        // information unique to each device such as the ip
        const session_id = hash('sha512', req.body.uname + hash('sha512', req.body.pass))
        await Credentials.create_session(req.body.uname, session_id)
        res.setHeader('Set-Cookie', `country_session=${session_id};Path=/`).json({result: 'success'})
    }
    else
        res.json({ result: "invalid credentials" })
}
