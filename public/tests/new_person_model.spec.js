// libs
import { expect } from 'chai';
import sinon from 'sinon';

// modules to test
import { age_state , handleAge } from '../src/models/new_person_model.js';


/* \-----------------------------------------------/
 *                    tests
 * /-----------------------------------------------\ */
describe.only('new_person_model', ()=> {
    beforeEach(() => {
    });
    afterEach(() => {
    });

    describe(' init to empty age_state ', ()=> {
        it('value is empty string, error is empty string', () => {
            expect(age_state.value).to.equal('');
            expect(age_state.error).to.equal('');
        });
    });
    describe(' changes the model as appropriate, when handleAge is called', ()=> {
        it('when age is empty string, value is empty string, error is empty string', () => {
            // run
            handleAge('');
            //assert
            expect(age_state.value).to.equal('');
            expect(age_state.error).to.equal('');
        });
        it('when age is valid, value is age, error is empty string', () => {
            // run
            handleAge(4);
            //assert
            expect(age_state.value).to.equal(4);
            expect(age_state.error).to.equal('');
        });
        it('when age is in-valid, value is age, error is notice', () => {
            // run
            handleAge(1);
            //assert
            expect(age_state.value).to.equal(1);
            expect(age_state.error).to.equal('age must be more then 3');
        });
    });
});
