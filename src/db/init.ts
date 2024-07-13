import { DB, tables } from "./database"

async function setup() {
  await DB.instance.dbReady;

  await DB.instance.db.exec(`
    CREATE TABLE ${tables.artist_votes.table_name} (
      ${tables.artist_votes.candidate} TEXT PRIMARY KEY,  
      ${tables.artist_votes.votes} INTEGER  
    ); 
    CREATE TABLE ${tables.artists.table_name} (
      ${tables.artists.name} TEXT PRIMARY KEY,
      ${tables.artists.country} TEXT,
      ${tables.artists.song} TEXT
    ); 
    CREATE TABLE ${tables.countries.table_name} (
      ${tables.countries.name} TEXT PRIMARY KEY,
      ${tables.countries.password_hash} TEXT,
      ${tables.countries.salt} TEXT,
      ${tables.countries.session_id} TEXT
    );
    CREATE TABLE ${tables.logins.table_name} (
      ${tables.logins.password} TEXT PRIMARY KEY,
      ${tables.logins.votes} INTEGER
    );
  `);

  await DB.instance.db.close();
}

setup().catch(err => console.error(err.message));
