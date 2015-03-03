// imports
import {co} from '../helpers/libs.js';
import log from '../helpers/loggers.js';
import configs from '../configs.js';
import app from './app.js';
import connect_to_db from './db/connection.js';


// starting server

function* startServer() {
    log.info('env is: ' + configs.env + " !");
    yield connect_to_db();
    app.listen(configs.port);
    log.info('koa app listening on port ' + configs.port);
}

co(startServer);

