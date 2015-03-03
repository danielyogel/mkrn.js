// imports
import {Promise, expect, merge, request} from '../../helpers/libs.js';
import log from '../../helpers/loggers.js';
import app from '../../app/app.js';

// tests
var agent = request.agent(app.listen());

describe('Routes static', ()=> {
    it('index.html, when GET /', function* () {
        var response = yield agent.get('/').end();
        expect(response.status).to.equal(200);
        expect(response.type).to.equal('text/html');
        expect(response.text).to.contain('<!DOCTYPE html>');
    });
});