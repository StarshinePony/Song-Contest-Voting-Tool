import { hash } from 'crypto'
import fs from 'fs'
import { DB } from './db/database'

export default class Credentials {
    static admin_auth_check(auth: string): boolean {
        const creds = fs.readFileSync('credentials.txt', 'utf-8').split('\n')
        if (creds.length <= 1) {
            console.error("Improper credentials file format")
            return false
        }
        return hash('sha512', creds[0] + creds[1]) === auth
    }

    static admin_login_check(uname: string, pass: string): boolean {
        const creds = fs.readFileSync('credentials.txt', 'utf-8').split('\n')
        if (creds.length <= 1) {
            console.error("Improper credentials file format")
            return false
        }
        return creds[0] === uname && (hash('sha512', pass) === creds[1])
    }

    static async country_session_check(session_id: string): Promise<boolean> {
        return !!await DB.instance.get_country_by_session(session_id)
    }

    static async country_login_check(uname: string, password: string): Promise<boolean> {
        const country = await DB.instance.get_country(uname)
        return !!(country && (country.password_hash === hash('sha512', password + country.salt)))
    }

    static async create_session(country_name: string, session_id: string) {
        await DB.instance.add_session(country_name, session_id)
    }
}