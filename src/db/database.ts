import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { createHash, randomBytes } from 'crypto';

// TODO: this is rly poorly made rn
// renaming any of the strings would mean the corresponding
// type's key would need to be renamed as well
export const tables = {
  artist_votes: {
    table_name: 'artist_votes',
    ip: 'ip',
    candidate: 'candidate'
  },
  artists: {
    table_name: 'artists',
    name: 'name',
    country: 'country',
    song: 'song'
  },
  countries: {
    table_name: 'countries',
    name: 'name',
    password_hash: 'password_hash',
    salt: 'salt',
    session_id: 'session_id'
  }
}

export type Artist = {
  name: string,
  country: string,
  song: string
}

export type Country = {
  name: string,
  password_hash: string,
  salt: string,
  session_id: string
}

export class DB {
  static instance: DB = new DB();

  // TODO: make this package private otherwise a good chunk of credentials.ts would be redundant
  db!: Database;
  dbReady: Promise<void>;

  private constructor() {
    this.dbReady = this.init();
  }

  private async init() {
    this.db = await open({
      filename: './database_thingy.db',
      driver: sqlite3.Database
    });
    console.log("Database Ready")
  }

  public async cast_vote(ip: string, candidate: string) {
    await this.dbReady;

    await this.db.run(
      `INSERT OR REPLACE INTO ${tables.artist_votes.table_name} (${tables.artist_votes.ip}, ${tables.artist_votes.candidate}) VALUES (?, ?)`,
      ip, candidate
    )
  }

  public async remove_vote(ip: string) {
    await this.dbReady;

    await this.db.run(
      `DELETE FROM ${tables.artist_votes.table_name} WHERE ip = ?`,
      ip
    )
  }

  public async add_musician_candidate(name: string, country: string, song: string): Promise<boolean> {
    await this.dbReady;

    try {
      await this.db.run(`INSERT INTO ${tables.artists.table_name} (${tables.artists.name}, ${tables.artists.country}, ${tables.artists.song}) VALUES (?, ?, ?)`, name, country, song)
    } catch (err) {
      // TODO: potential for error to be caused by something else other than the candidate already being present
      // should probably switch return type for sending precise feedback
      return false;
    }
    return true;
  }

  public async create_country_account(name: string, password: string): Promise<boolean> {
    await this.dbReady;

    try {
      const salt = randomBytes(16).toString('base64');
      const hash = createHash('sha512').update(password + salt).digest('hex');
      await this.db.run(`INSERT INTO ${tables.countries.table_name} (${tables.countries.name}, ${tables.countries.password_hash}, ${tables.countries.salt}, ${tables.countries.session_id
        }) VALUES (?, ?, ?, ?)`,
        name,
        hash,
        salt,
        null
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async get_country(name: string): Promise<Country | undefined> {
    await this.dbReady;

    return await this.db.get(
      `SELECT * FROM ${tables.countries.table_name} WHERE ${tables.countries.name}=?`,
      name
    );
  }

  public async get_country_by_session(session_id: string): Promise<Country | undefined> {
    await this.dbReady;

    return await this.db.get(
      `SELECT * FROM ${tables.countries.table_name} WHERE ${tables.countries.session_id}=?`,
      session_id
    );
  }

  public async get_artists(): Promise<Artist[] | undefined> {
    await this.dbReady;

    return this.db.all(`SELECT * FROM ${tables.artists.table_name}`);
  }

  public async add_session(country_name: string, session_id: string) {
    await this.dbReady;

    await this.db.run(
      `UPDATE ${tables.countries.table_name} SET ${tables.countries.session_id}=? WHERE ${tables.countries.name}=?`,
      session_id, country_name
    );
  }
}
