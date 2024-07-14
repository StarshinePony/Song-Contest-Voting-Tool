import type { NextApiRequest, NextApiResponse } from 'next';
import { DB } from '@/db/database';
import { randomBytes } from 'crypto';
import { stringify } from 'csv-stringify/sync';
import adminHandler from '@/admin_handler';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { numAccounts } = req.body;
    const logins = [];

    for (let i = 0; i < numAccounts; i++) {
        const password = generateRandomSixDigitNumber();
        const votes = 10;
        await DB.instance.create_login(password, votes);
        logins.push({ password, votes });
    }

    const csv = stringify(logins, { header: true });
    res.json({ csv });
}

export default adminHandler(handler)

// Function to generate a random 6-digit number
const generateRandomSixDigitNumber = () => {
    const randomNumber = randomBytes(3).readUIntBE(0, 3); // Generate a random number from 0 to 2^24 - 1
    const sixDigitNumber = (randomNumber % 900000) + 100000; // Ensure it's a 6-digit number
    return sixDigitNumber.toString().padStart(6, '0'); // Convert to string and pad with leading zeros if necessary
};
