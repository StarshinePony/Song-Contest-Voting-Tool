import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';

let rude_reject_msg: string = ''

try { rude_reject_msg = fs.readFileSync('rude_reject_msg.txt', 'utf8'); }
catch (err) { console.error(err) };

type ResponseData = {
  result?: string,
}
 
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log(`${req.body.uname} - ${req.body.pass}`)
    // TODO
    if (req.body.uname === "user" && req.body.pass === "12345")
      // TODO: also terribly unsecure for now
      res.setHeader('Auth', `${req.body.uname}-${req.body.pass}`).status(200).json({result: "nop"})
    else
      res.status(200).json({result: rude_reject_msg})
}