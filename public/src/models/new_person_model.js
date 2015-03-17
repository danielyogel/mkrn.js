// libs
//import  reqwest from 'reqwest';
//import  _ from 'ramda';
import  { eventEmitter, objectAssign, _ } from '../helpers/libs.js';
//api
import {  } from '../api/items_api.js';

/* \--------------------------------------------------------------------------------------------/
 *                    age
 * /--------------------------------------------------------------------------------------------\ */

// state
export var age_model = {
    value: '',
    error: '',
    handler: function handleAge(age) {
        var validator = (age) =>  age > 3,
            empty_age = age === '',
            is_valid = validator(age);
        if (empty_age) {
            objectAssignThenEmit(age_model, {value: '', error: ''});
        } else {
            if (is_valid) {
                objectAssignThenEmit(age_model, {value: age, error: ''});
            } else {
                objectAssignThenEmit(age_model, {value: age, error: 'age must be more then 3'});
            }
        }
    }
};


/* \--------------------------------------------------------------------------------------------/
 *                    name
 * /--------------------------------------------------------------------------------------------\ */















/* \--------------------------------------------------------------------------------------------/
 *                    helpers
 * /--------------------------------------------------------------------------------------------\ */

function updateStateAndEmit(updatesObj) {
    objectAssign(state, updatesObj);
    eventEmitter.emit('new_person_model_update');
}

function objectAssignThenEmit(obj, updatesObj) {
    objectAssign(obj, updatesObj);
    eventEmitter.emit('new_person_model_update');
}
