const core = require('@actions/core');
const wait = require('./wait');
const fs = require('fs');
const exec = require('child_process').execFile;

// most @actions toolkit packages have async methods
async function run() {
    try {
        core.info(`JGantts.com Custom Deployment`);

        exec(`cd jgantts.com`)

        const srcFiles = fs.readdirSync('');
        srcFiles.forEach(file => {
            core.info(`${file}`);
        });

        exec(`npm install`);
        exec(`tsc`);

        const distFiles = fs.readdirSync('jgantts.com');
        distFiles.forEach(file => {
            core.info(`${file}`);
        });


        const files = fs.readdirSync('jgantts.com');

        const ms = core.getInput('milliseconds');
        core.info(`Waiting ${ms} milliseconds ...`);

        core.debug((new Date()).toTimeString()); // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
        await wait(parseInt(ms));
        core.info((new Date()).toTimeString());

        core.setOutput('time', new Date().toTimeString());
    } catch (error) {
        core.info(`Unknown error.`);
        try {
            core.info(`Files:`);
            const files = fs.readdirSync('');
            files.forEach(file => {
                core.info(`${file}`);
            });
        } catch (error2) {
            core.info(`Error encountered while displaying error: ${error2.message}`);
        }
        core.info(error.message));
        core.setFailed(error.message);
    }
}

run();
