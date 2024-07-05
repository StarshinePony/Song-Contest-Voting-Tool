import { Poll } from "./poll"

async function setup() {

  await Poll.instance.dbReady;

  await Poll.instance.db.exec(`
    CREATE TABLE votes (
      ip TEXT PRIMARY KEY,  
      candidate TEXT  
    );
  `)

  await Poll.instance.db.run(
    'INSERT INTO votes (ip, candidate) VALUES (?, ?)',
    'some_ip',
    'some_candidate'
  )
  
  await Poll.instance.db.close()  
}

setup()
  .catch(err => console.error(err.message))