// imports
import {assert, is, vError } from './libs.js';
import log from './loggers.js';

// error helpers
export function handleOperationalErr(err, msg) {
    assert((is(Object, err) && is(String, msg)), 'handleOperationalErr requires err and msg as arguments');
    if (err.isOperational) {
        var oErr = new vError(err, msg);
        oErr.isOperational = true;
        log.warn(oErr);
    } else {
        throw err;
    }
}


export function wrapOperationalErr(err, msg) {
    assert((is(Object, err) && is(String, msg)), 'wrapOperationalErr requires err and msg as arguments');
    if (err.isOperational) {
        var oErr = new vError(err, msg);
        oErr.isOperational = true;
        throw oErr;
    } else {
        throw err;
    }
}


export function throwOperationalErr(err, msg) {
    assert((is(Object, err) && is(String, msg)), 'throwOperationalErr requires err and msg as arguments');
    var oErr = new vError(err, msg);
    oErr.isOperational = true;
    throw oErr;
}


export function throwClientError(status, msg) {
    var err = new Error(msg);
    err.status = status;
    throw err;
}

