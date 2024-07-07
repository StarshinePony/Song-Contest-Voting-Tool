import { Poll, tables } from "./poll"

async function setup() {

  await Poll.instance.dbReady;

  await Poll.instance.db.exec(`
    CREATE TABLE ${tables.artist_votes.table_name} (
      ${tables.artist_votes.ip} TEXT PRIMARY KEY,  
      ${tables.artist_votes.candidate} TEXT  
    ); CREATE TABLE ${tables.artists.table_name} (
      ${tables.artists.name} TEXT PRIMARY KEY,
      ${tables.artists.country} TEXT,
      ${tables.artists.song} TEXT
    ); Create TABLE ${tables.countries.table_name} (
      ${tables.countries.name} TEXT PRIMARY KEY,
      ${tables.countries.password_hash} TEXT
    );
  `)
  
  await Poll.instance.db.close()  
}

setup()
  .catch(err => console.error(err.message))