import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { createHash, randomBytes } from 'crypto';

export const tables = {
  artist_votes: {
    table_name: 'artist_votes',
    candidate: 'candidate',
    votes: 'votes'
  },
  candidates: {
    table_name: 'candidates',
    name: 'name',
    country: 'country',
    song: 'song',
    password_hash: 'password_hash',
    salt: 'salt',
    session_id: 'session_id'
  },
  logins: {
    table_name: 'logins',
    login_code: 'login_code',
    voted: 'voted'
  },
  country_rankings: {
    table_name: 'country_rankings',
    voter: 'voter',
    rankings: 'rankings'
  }
}


export type Candidate = {
  name: string,
  country: string,
  song: string,
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

  public async cast_vote(candidate: string, votes_to_add: number) {
    await this.dbReady;

    let candidates_votes = await this.db.get(
      `SELECT ${tables.artist_votes.votes} FROM ${tables.artist_votes.table_name} WHERE ${tables.artist_votes.candidate} = ?`,
      candidate
    );

    candidates_votes = candidates_votes ? candidates_votes.votes + votes_to_add : votes_to_add

    await this.db.run(
      `INSERT OR REPLACE INTO ${tables.artist_votes.table_name} (${tables.artist_votes.candidate}, ${tables.artist_votes.votes}) VALUES (?, ?)`,
      candidate, candidates_votes
    );
  }

  public async get_votes(): Promise<{ candidate: string, votes: number }[]> {
    await this.dbReady;

    return await this.db.all(`SELECT * FROM ${tables.artist_votes.table_name}`)
  }

  public async set_voted(loginCode: string) {
    await this.dbReady;
    await this.db.run(
      `UPDATE ${tables.logins.table_name} SET ${tables.logins.voted} = ? WHERE ${tables.logins.login_code} = ?`,
      'true', loginCode
    );
  }

  public async remove_vote(ip: string) {
    await this.dbReady;

    await this.db.run(
      `DELETE FROM ${tables.artist_votes.table_name} WHERE ip = ?`,
      ip
    )
  }

  public async add_candidate(name: string, country: string, song: string, pass: string): Promise<boolean> {
    await this.dbReady;

    try {
      const salt = randomBytes(16).toString('base64');
      const hashed_password = createHash('sha512').update(pass + salt).digest('hex');
      await this.db.run(`INSERT INTO ${tables.candidates.table_name} (${tables.candidates.name}, ${tables.candidates.country}, ${tables.candidates.song}, ${tables.candidates.password_hash}, ${tables.candidates.salt}, ${tables.candidates.session_id
        }) VALUES (?, ?, ?, ?, ?, ?)`,
        name,
        country,
        song,
        hashed_password,
        salt,
        null
      );
      
      return true
    }
    catch (err) {return false}
  }

  public async create_login(login_code: string): Promise<boolean> {
    await this.dbReady;

    try {
      await this.db.run(`INSERT INTO ${tables.logins.table_name} (${tables.logins.login_code}, ${tables.logins.voted}) VALUES (?, 'false')`, login_code);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  public async get_logins(): Promise<{ login_code: string, voted: string }[]> {
    await this.dbReady;

    return (await this.db.all(`SELECT * FROM ${tables.logins.table_name}`));
  }

  public async get_candidate(uname: string): Promise<Candidate | undefined> {
    await this.dbReady;

    return await this.db.get(
      `SELECT * FROM ${tables.candidates.table_name} WHERE ${tables.candidates.name}=?`,
      uname
    );
  }

  public async get_candidate_by_session(session_id: string): Promise<Candidate | undefined> {
    await this.dbReady;

    return await this.db.get(
      `SELECT * FROM ${tables.candidates.table_name} WHERE ${tables.candidates.session_id}=?`,
      session_id
    );
  }

  public async get_country_names(): Promise<string[]> {
    await this.dbReady;

    return (await this.db.all(`SELECT ${tables.candidates.country} FROM ${tables.candidates.table_name}`)).map(entry => entry.country)
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

  public async get_candidates(): Promise<Candidate[]> {
    await this.dbReady;

    return this.db.all(`SELECT * FROM ${tables.candidates.table_name}`);
  }

  public async add_session(country_name: string, session_id: string) {
    await this.dbReady;

    await this.db.run(
      `UPDATE ${tables.candidates.table_name} SET ${tables.candidates.session_id}=? WHERE ${tables.candidates.name}=?`,
      session_id, country_name
    );
  }
  
  public async get_has_voted(code: string): Promise<boolean | undefined> {
    await this.dbReady;

    const entry = await this.db.get(`SELECT ${tables.logins.voted} FROM ${tables.logins.table_name} WHERE ${tables.logins.login_code}=?`, code);

    return entry ? entry.voted === 'true' : undefined
  }
}
