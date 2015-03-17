// libs
import { expect } from 'chai';
import sinon from 'sinon';

// modules to test
import { signUp as sendSignUp } from '../src/api/user_api.js';


/* \-----------------------------------------------/
 *                    tests
 * /-----------------------------------------------\ */
describe('User API', ()=> {
    var xhr, request;
    beforeEach(() => {
        xhr = sinon.useFakeXMLHttpRequest();
        xhr.onCreate = function (req) {
            request = req;
        }
    });
    afterEach(() => {
        xhr.restore();
        request = null;
    });

    describe('#signUp', ()=> {
        it('When provided signup details, sends POST to /signup', () => {
            sendSignUp({email: 'some@email.com', first: 'joe', last: 'cohen', password: '12345678'});
            console.log(request.requestBody);
            expect(request).to.be.instanceOf(Object);
            expect(request.requestBody).to.contain('first');
        });
    });
});
