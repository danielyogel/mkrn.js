// imports
import {Promise, vError, mongoose} from '../../helpers/libs.js';
import configs from '../../configs.js';
import log from '../../helpers/loggers.js';

// configure database
export default function connect_to_db() {
    return new Promise((resolve, reject)=> {
        var DB_URI = "mongodb://" + configs.db.address + ":" + configs.db.port + '/' + configs.db.name + '-' + configs.env;
        mongoose.connect(DB_URI);
        var db = mongoose.connection;
        db.on('error', (err) => {
            log.error('Failed to connet to database. msg is: ' + err.message);
            reject(new vError(err, 'failed to connect to mongoDB'));
        });
        db.once('open', (whatever) => {
            if (process.env.MONGODB_PORT_27017_TCP_ADDR) {
                log.info('Connecting to the linked docker mongoD');
            } else {
                log.info('Connecting to the LOCALHOST MongoDB server');
            }
            log.info('mongoose just connected to mongod at: ' + DB_URI );
            resolve();
        });
    })
};
