// pages/api/download_database.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createReadStream } from 'fs';
import { join } from 'path';

export default (req: NextApiRequest, res: NextApiResponse) => {
    const dbPath = join(process.cwd(), 'database_thingy.db'); // Adjusted path to your database
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=database.db');
    const fileStream = createReadStream(dbPath);
    fileStream.pipe(res);
};
