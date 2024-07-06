import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  result?: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    
}
