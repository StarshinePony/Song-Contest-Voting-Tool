import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "crypto";
import fs from "fs";
import { assert } from "console";

let credentials = fs.readFileSync('credentials.txt', 'utf8').split('\n')
assert(credentials.length > 1, "credentials.txt should be separated into two lines")

type APIResponse = {result: string}
type Handler = (req: NextApiRequest, res: NextApiResponse<APIResponse>) => void | Promise<void>

const adminHandler = (handler: Handler) => async (req: NextApiRequest, res: NextApiResponse<APIResponse>) => {
    credentials = fs.readFileSync('credentials.txt', 'utf8').split('\n')
    
    if (req.cookies.Auth === hash('sha512', credentials[0] + credentials[1]))
        await handler(req, res)
    else
        res.json({result: "Not logged in"})
}

export default adminHandler