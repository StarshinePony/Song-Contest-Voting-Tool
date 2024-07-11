import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import Credentials from '@/credentials';

const hashData = (data: string) => {
  const hash = crypto.createHash('sha512');
  hash.update(data);
  return hash.digest('hex');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (Credentials.admin_login_check(req.body.uname, req.body.pass)) {
    const hashedPassword = hashData(req.body.pass);
    const authKey = hashData(req.body.uname + hashedPassword);
    res.setHeader('Set-Cookie', `Auth=${authKey}; Path=/`).json({ result: 'success' });
  } else {
    res.json({ result: "invalid credentials" });
  }
}
