import { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '@/db/database';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const loginCode = cookies.loginCode;
    const { candidate } = req.body;

    if (!loginCode) {
      res.status(400).json({ success: false, message: 'No login code found in cookies.' });
      return;
    }

    try {
      const login = await DB.instance.check_login(loginCode);
      if (!login || login.votes <= 0) {
        res.status(400).json({ success: false, message: 'No remaining votes or invalid login.' });
        return;
      }

      await DB.instance.cast_vote(candidate);
      const remainingVotes = login.votes - 1;
      await DB.instance.update_remaining_votes(loginCode, remainingVotes);

      res.status(200).json({ success: true, remainingVotes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
