// imports
import {koa, koaLogger, bodyParser, session, mongoose, serve, path} from '../helpers/libs.js';
import configs from '../configs.js';
import log from '../helpers/loggers.js';
import errorMiddleware from './error_middleware';
import routesMiddleware from './routes/index.js';


// app configuration
var app = koa();
app.use(koaLogger(log, {
    level: configs.env === 'test' ? 'debug' : 'info',
    timeLimit: 1000
}));
app.use(bodyParser());
app.keys = ['some secret'];
app.use(session({
    key: 'sid',
    collection: mongoose.connection.collection('session')
}));
errorMiddleware(app);
app.use(serve(path.join(__dirname, '../../../public/')));
routesMiddleware(app);

// default export
export default app;






