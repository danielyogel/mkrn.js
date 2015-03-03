// imports
import {koa, koaLogger, bodyParser, session, mongoose} from '../helpers/libs.js';
import errorMiddleware from './error_middleware';
import routesMiddleware from './routes/index.js';
import configs from '../configs.js';
import log from '../helpers/loggers.js';

// export error middle ware
export default function error_middleware(app) {
    app.use(errorHandler());

    function errorHandler() {
        return function* (next) {
            try {
                yield next;
            } catch (err) {
                if (err.status && err.message) {
                    this.body = {failure: err.message};
                    this.status = err.status;
                } else {
                    this.body = 'internal server error';
                    this.status = 500;
                }

                this.app.emit('error', err, this);
            }
        };
    }

    app.on('error', function (err) {
        if (configs.env !== 'test') {
            log.warn('sent error ' + err.message + ' to the cloud');
            log.warn(err);
        }
    });
};


