import type { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'crypto';
import fs from 'fs';
import adminHandler from '@/admin_handler';
 
async function handler(req: NextApiRequest, res: NextApiResponse) {
    // in case the request doesn't come from using the client ui for whatever reason
    if (req.body.length < 8)
        return res.json({ result: 'New password must have at least 8 characters' })

    const credential_lines = fs.readFileSync('credentials.txt', 'utf8').split('\n');
    if (credential_lines[1] !== hash('sha512', req.body.currentPass))
        return res.json({ result: "Invalid Password" })

    if (req.body.currentPass === req.body.newPass)
        return res.json({ result: "Old password can't be the same as new password" })
    
    credential_lines[1] = hash('sha512', req.body.newPass);
    fs.writeFileSync('credentials.txt', credential_lines.join('\n'), 'utf8');
    
    res.setHeader('Set-Cookie', `Auth=${hash('sha512', credential_lines[0] + credential_lines[1])};Path=/`)
        .json({ result: 'Password Changed' })
}

export default adminHandler(handler)
