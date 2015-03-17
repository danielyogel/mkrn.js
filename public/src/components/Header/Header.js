//libs
import {  _, reqwest , eventEmitter } from '../../helpers/libs.js';
import React from 'react';
// router
import { updateQueryParams, deleteQueryParam } from '../../router.js';
// mixins
import { ModelEventsMixin } from '../../helpers/react_mixins.js';

/* \--------------------------------------------------------------------------------------------/
 *                    HEADER component
 * /--------------------------------------------------------------------------------------------\ */
export default React.createClass({
    mixins: [ModelEventsMixin],
    modelsToListen: ['user'],
    render: function () {
        return (
            <header className='site-header clearfix'>
                <h1 className='site-header__logo'>MKRN.js
                </h1>

            </header>
        );
    }
});
