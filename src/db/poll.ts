import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

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
    password_hash: 'password_hash' 
  }
}

type artist = {
  name: string,
  country: string,
  song: string
}

type country = {
  name: string
}

export class Poll {
  static instance: Poll = new Poll();

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

  public async add_candidate(type: string, name: string, country_or_hash: string, song?: string): Promise<boolean> {
    await this.dbReady;

    try {
      switch (type) {
        case "artist":
          await this.db.run(`INSERT INTO ${tables.artists.table_name} (${tables.artists.name}, ${tables.artists.country}, ${tables.artists.song}) VALUES (?, ?, ?)`, name, country_or_hash, song)
          break;
        case "country":
          await this.db.run(`INSERT INTO ${tables.countries.table_name} (${tables.countries.name}, ${tables.countries.password_hash}) VALUES (?, ?)`, name, country_or_hash)
          break;
        default:
          console.error(`Invalid candidate type "${type}"`)
          return false;
      }
    } catch (err) {
      // TODO: potential for error to be caused by something else other than the candidate already being present
      // should probably switch return type for sending precise feedback
      return false;
    }
    return true;
  }

  public async get_artists(): Promise<artist[] | undefined> {
    await this.dbReady;
    return this.db.all(`SELECT * FROM ${tables.artists.table_name}`)
  }
}