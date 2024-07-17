import { createHash } from "crypto";
import { DB, tables } from "./database"

async function setup() {
  await DB.instance.dbReady;

  await DB.instance.db.exec(`
    CREATE TABLE ${tables.artist_votes.table_name} (
      ${tables.artist_votes.candidate} TEXT PRIMARY KEY,  
      ${tables.artist_votes.votes} INTEGER  
    ); 
    CREATE TABLE ${tables.candidates.table_name} (
      ${tables.candidates.name} TEXT PRIMARY KEY,
      ${tables.candidates.country} TEXT,
      ${tables.candidates.song} TEXT,
      ${tables.candidates.password_hash} TEXT,
      ${tables.candidates.salt} TEXT,
      ${tables.candidates.session_id} TEXT
    );
    CREATE TABLE ${tables.logins.table_name} (
      ${tables.logins.login_code} TEXT PRIMARY KEY,
      ${tables.logins.voted} INTEGER
    );
    CREATE TABLE ${tables.country_rankings.table_name} (
      ${tables.country_rankings.voter} TEXT PRIMARY KEY,
      ${tables.country_rankings.rankings} TEXT
    );
    
  `);

  if (process.argv.length > 2 && process.argv[2].toLowerCase() === 'use-sample-data')
    for (let i = 1; i <= 12; ++i)
      await DB.instance.db.run(
        `INSERT INTO ${tables.candidates.table_name} (
          ${tables.candidates.name}, ${tables.candidates.country}, ${tables.candidates.song},
          ${tables.candidates.password_hash}, ${tables.candidates.salt}, ${tables.candidates.session_id}
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        `candidate${i}`, `song${i}`, `country${i}`,
        createHash('sha512').update(`${i}`).digest('hex'), 'salt', null
      )

  await DB.instance.db.close();
}

setup().catch(err => console.error(err.message));
