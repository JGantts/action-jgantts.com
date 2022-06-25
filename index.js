const core = require('@actions/core');
const wait = require('./wait');
const fs = require('fs');
const exec = require('child_process').execSync;
const { Client } = require('ssh2');

// most @actions toolkit packages have async methods
async function run() {
    try {
        core.info(`JGantts.com Custom Deployment`);

        const ms = core.getInput('milliseconds');
        const namecheap_username = core.getInput('namecheap_username');
        const namecheap_ssh_port = core.getInput('namecheap_ssh_port');
        const namecheap_ssh_key = core.getInput('namecheap_ssh_key');

        core.info(exec(`cd jgantts.com`));

        core.info(`Dir print 1`);
        core.info(exec(`ls`));

        core.info(exec(`npm install`));
        core.info(exec(`tsc`));

        core.info(`Dir print 2`);
        core.info(exec(`ls dist`));


        let c = new Client();

        c.on('connect', function() {
          console.log('Connection :: connect');
        });

        c.on('ready', function() {
          console.log('Connection :: ready');
          c.exec('uptime', function(err, stream) {
            if (err) throw err;
            stream.on('data', function(data, extended) {
              core.info((extended === 'stderr' ? 'STDERR: ' : 'STDOUT: ') + data);
            });
            stream.on('end', function() {
              core.info('Stream :: EOF');
            });
            stream.on('close', function() {
              core.info('Stream :: close');
            });
            stream.on('exit', function(code, signal) {
              core.info('Stream :: exit :: code: ' + code + ', signal: ' + signal);
              c.end();
            });
          });
        });

        c.on('error', function(err) {
          core.info('Connection :: error :: ' + err);
        });

        c.on('end', function() {
          core.info('Connection :: end');
        });

        c.on('close', function(had_error) {
          core.info('Connection :: close');
        });

        c.connect({
            host: `jgantts.com`,
            username: namecheap_username,
            port: namecheap_ssh_port,
            privateKey: namecheap_ssh_key
        });

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
        core.info(error.message);
        core.setFailed(error.message);
    }
}

run();
