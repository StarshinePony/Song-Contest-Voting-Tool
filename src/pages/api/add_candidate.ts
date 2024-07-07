import { Poll } from '@/db/poll'
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  result?: boolean,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const added = await Poll.instance.add_candidate(
      req.body.type.toLowerCase(),
      req.body.input1,
      req.body.input2,
      req.body.input3
    );

    res.json({result: added})
}
