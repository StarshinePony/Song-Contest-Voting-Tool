import { hash } from 'crypto';
import fs from 'fs';
import * as readline from 'readline/promises';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function init_credentials() {
    try {
        let inputs = ['', '']

        while (true) {
            while (!inputs[0])
                inputs[0] = await rl.question('Input Username: ')

            while (!inputs[1])
                inputs[1] = await rl.question('Input Password: ')

            if (((await rl.question(`Confirm: (y)\n`)).toLowerCase() === "y"))
                break

            inputs[0] = ''
            inputs[1] = ''
        }

        fs.writeFileSync('credentials.txt', `${inputs[0]}\n${hash('sha512', inputs[1])}`)
        console.log("Saved username and password hash in credentials.txt")
    } finally {
        rl.close();
    }
}

init_credentials()