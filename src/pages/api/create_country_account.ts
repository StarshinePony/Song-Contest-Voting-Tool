import type { NextApiRequest, NextApiResponse } from 'next'
import { DB } from '@/db/database';
import adminHandler from '@/admin_handler';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const created = await DB.instance.create_country_account(
    req.body.countryName,
    req.body.countryPass
  )

  res.json({ result: created ? "Account Successfully Created" : "Country Already Present" })
}

export default adminHandler(handler)
