import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

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

    const existing_vote = await this.db.get('SELECT * FROM votes WHERE ip=?', ip);

    if (existing_vote)
      return await this.db.run(
        'UPDATE votes SET candidate=? WHERE ip=?',
        candidate, ip
      )
    
    await this.db.run(
      'INSERT INTO votes (ip, candidate) VALUES (?, ?)',
      ip, candidate
    )
  }
}