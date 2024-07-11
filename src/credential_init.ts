import crypto from 'crypto';
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

            while (!inputs[1]) {
                inputs[1] = await rl.question('Input Password: ')
                if (inputs[1].length < 8) {
                    inputs[1] = ''
                    console.log('Password must have at least 8 characters')
                }
            }

            if (((await rl.question(`Confirm: (y)\n`)).toLowerCase() === "y"))
                break

            inputs[0] = ''
            inputs[1] = ''
        }

        const hash = crypto.createHash('sha512');
        hash.update(inputs[1]);
        const hashedPassword = hash.digest('hex');

        fs.writeFileSync('credentials.txt', `${inputs[0]}\n${hashedPassword}`)
        console.log("Saved username and password hash in credentials.txt")
    } finally {
        rl.close();
    }
}

init_credentials();
