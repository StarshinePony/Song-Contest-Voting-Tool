import crypto from 'crypto';
import fs from 'fs';
import { DB } from './db/database';

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

    static async country_session_check(session_id: string): Promise<boolean> {
        return !!await DB.instance.get_country_by_session(session_id);
    }

    static async country_login_check(uname: string, password: string): Promise<boolean> {
        const country = await DB.instance.get_country(uname);
        if (!country) return false;

        const hash = crypto.createHash('sha512');
        hash.update(password + country.salt);
        const hashedPassword = hash.digest('hex');

        return country.password_hash === hashedPassword;
    }

    static async create_session(country_name: string, session_id: string) {
        await DB.instance.add_session(country_name, session_id);
    }
}
