// modules
import {Promise, vError} from '../helpers/libs.js';
import log from '../helpers/loggers.js';
import configs from '../configs.js';
import connect_to_db from '../app/db/connection.js';

// co support for mocha
import 'co-mocha';

// tests set tp
log.info('Setting up tests! NODE_ENV is: ' + configs.env + " !");

process.on('uncaughtException', err => {
    log.fatal(new vError(err, 'Unexpected Programmer error, exiting process intentionally'));
    process.exit(1);
});

Promise.onPossiblyUnhandledRejection((error) => {
    throw error
});

before(() => connect_to_db());
