import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { createHash, randomBytes } from 'crypto';

export const tables = {
  artist_votes: {
    table_name: 'artist_votes',
    candidate: 'candidate',
    votes: 'votes'
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
  },
  logins: {
    table_name: 'logins',
    password: 'password',
    votes: 'votes'
  },
  country_rankings: {
    table_name: 'country_rankings',
    voter: 'voter',
    rankings: 'rankings'
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
export type Login = {
  password: string,
  votes: number
}

type Ranking_Entry = {
  country: string,
  ranking_points: number
}

type Voter_Rankings = {
  voter: string,
  rankings: Ranking_Entry[]
}

export class DB {
  static instance: DB = new DB();

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

  public async cast_vote(candidate: string) {
    await this.dbReady;
    const existingVote = await this.db.get(
      `SELECT ${tables.artist_votes.votes} FROM ${tables.artist_votes.table_name} WHERE ${tables.artist_votes.candidate} = ?`,
      candidate
    );

    if (existingVote) {
      await this.db.run(
        `UPDATE ${tables.artist_votes.table_name} SET ${tables.artist_votes.votes} = ${tables.artist_votes.votes} + 1 WHERE ${tables.artist_votes.candidate} = ?`,
        candidate
      );
    } else {
      await this.db.run(
        `INSERT INTO ${tables.artist_votes.table_name} (${tables.artist_votes.candidate}, ${tables.artist_votes.votes}) VALUES (?, 1)`,
        candidate
      );
    }
  }

  public async update_remaining_votes(loginCode: string, remainingVotes: number) {
    await this.dbReady;
    await this.db.run(
      `UPDATE ${tables.logins.table_name} SET ${tables.logins.votes} = ? WHERE ${tables.logins.password} = ?`,
      remainingVotes, loginCode
    );
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

  public async create_login(password: string, votes: number): Promise<boolean> {
    await this.dbReady;

    try {
      await this.db.run(`INSERT INTO ${tables.logins.table_name} (${tables.logins.password}, ${tables.logins.votes}) VALUES (?, ?)`, password, votes);
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

  public async get_country_names(): Promise<string[]> {
    await this.dbReady;

    return (await this.db.all(`SELECT ${tables.countries.name} FROM ${tables.countries.table_name}`)).map(country => country.name)
  }

  public async submit_rankings(voter_name: string, rankings: any[]) {
    await this.dbReady;

    await this.db.run(
      `INSERT OR REPLACE INTO ${tables.country_rankings.table_name} (${tables.country_rankings.voter}, ${tables.country_rankings.rankings}) VALUES (?, ?)`,
      voter_name, JSON.stringify(rankings)
    )
  }

  public async get_rankings(): Promise<Voter_Rankings[]> {
    await this.dbReady;

    return (await this.db.all(`SELECT * FROM ${tables.country_rankings.table_name}`))
      .map(voter_rankings => ({ voter: voter_rankings.voter, rankings: JSON.parse(voter_rankings.rankings) }))
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
  public async check_login(code: string): Promise<Login | undefined> {
    await this.dbReady;

    return await this.db.get(
      `SELECT * FROM ${tables.logins.table_name} WHERE ${tables.logins.password}=?`,
      code
    );
  }
}
