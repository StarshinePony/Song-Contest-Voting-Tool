import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'crypto';
import Credentials from '@/credentials';
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (Credentials.admin_login_check(req.body.uname, req.body.pass))
    // hash() twice since the password hash is stored and the hash(uname + stored hash) is checked against the auth key
    // it's actual not great practice to make these non-random but this should hopefully be good enough
    res.setHeader('Set-Cookie', `Auth=${hash('sha512', req.body.uname + hash('sha512', req.body.pass))};Path=/`).json({result: 'success'})
  else
    res.json({result: "invalid credentials"})
}
