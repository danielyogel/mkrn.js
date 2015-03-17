//libs
import {  _, reqwest , eventEmitter } from '../../../helpers/libs.js';
import mui from 'material-ui';
import React from 'react';
// router
import { updateQueryParams, deleteQueryParam } from '../../../router.js';
// mixins
import { ModelEventsMixin } from '../../../helpers/react_mixins.js';
// models
import { age_model  } from '../../../models/new_person_model.js';
// Components
var { TextField, FlatButton } = mui;

/* \--------------------------------------------------------------------------------------------/
 *                    CreateForm component
 * /--------------------------------------------------------------------------------------------\ */
export default React.createClass({
    mixins: [ModelEventsMixin],
    modelsToListen: ['new_person'],
    getInitialState: function () {
        return {};
    },
    logAgeModel: function (e) {
        e.preventDefault();
        console.dir(age_model);
    },
    render: function () {
        return (
            <form className="create-form">
                <h1>CreateForm</h1>
                <TextField floatingLabelText='Enter name' value={ age_model.value } onChange={ e => age_model.handler(e.target.value) } errorText={ age_model.error }/>
            </form>
        );
    }
});


