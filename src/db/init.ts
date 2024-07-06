import { Poll } from "./poll"

async function setup() {

  await Poll.instance.dbReady;

  await Poll.instance.db.exec(`
    CREATE TABLE votes (
      ip TEXT PRIMARY KEY,  
      candidate TEXT  
    ); CREATE TABLE candidates (
      name TEXT PRIMARY KEY,
      country TEXT,
      song TEXT
    )
  `)
  
  await Poll.instance.db.close()  
}

setup()
  .catch(err => console.error(err.message))