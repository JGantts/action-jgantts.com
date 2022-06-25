const core = require('@actions/core');
const wait = require('./wait');
const fs = require('fs');


// most @actions toolkit packages have async methods
async function run() {
    try {
        core.info(`JGantts.com Custom Deployment`);

        //const files = fs.readdirSync('');

        // files object contains all files names
        // log them on console
        /*files.forEach(file => {
            core.info(`${file}`);
        });*/

        const ms = core.getInput('milliseconds');
        core.info(`Waiting ${ms} milliseconds ...`);

        core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
        await wait(parseInt(ms));
        core.info((new Date()).toTimeString());

        core.setOutput('time', new Date().toTimeString());
    } catch (error) {
        core.info(`Wut?`);
        core.setFailed(error.message);
    }
}

run();
