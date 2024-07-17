import crypto from 'crypto';
import fs from 'fs';
import { Candidate, DB } from './db/database';

export default class Credentials {
    static admin_auth_check(auth: string): boolean {
        const creds = fs.readFileSync('credentials.txt', 'utf-8').split('\n');
        if (creds.length <= 1) {
            console.error("Improper credentials file format");
            return false;
        }

        const hash = crypto.createHash('sha512');
        hash.update(creds[0] + creds[1]);
        const hashedCredentials = hash.digest('hex');

        return hashedCredentials === auth;
    }

    static admin_login_check(uname: string, pass: string): boolean {
        const creds = fs.readFileSync('credentials.txt', 'utf-8').split('\n');
        if (creds.length <= 1) {
            console.error("Improper credentials file format");
            return false;
        }

        const hash = crypto.createHash('sha512');
        hash.update(pass);
        const hashedPassword = hash.digest('hex');

        return creds[0] === uname && hashedPassword === creds[1];
    }

    static async country_login_check(uname: string, password: string): Promise<Candidate | undefined> {
        const country = await DB.instance.get_candidate(uname);
        console.log(country)
        if (!country) return undefined;

        const hashedPassword = crypto.createHash('sha512').update(password + country.salt).digest('hex');

        return country.password_hash === hashedPassword ? country : undefined;
    }

    static async create_session(uname: string, session_id: string) {
        await DB.instance.add_session(uname, session_id);
    }
}
