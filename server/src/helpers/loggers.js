// imports
import {path, bunyan} from './libs.js';
import configs from '../configs.js';

// logger configs
var inclue_file_path = configs.env === 'test' || false;
export default bunyan.createLogger({
    name: 'mkrn',
    src: inclue_file_path,
    serializers: bunyan.stdSerializers,
    streams: [
        {
            level: 'debug',        // <--  debug and up goes to stdout !
            stream: process.stdout
        },
        {
            level: 'warn',
            path: path.join(__dirname, '../../logs.log')  // <-- warn and up goes also to file !
        }
    ]
});

