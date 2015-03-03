//libs
import { React, _, reqwest , eventEmitter} from '../../helpers/libs.js';
import {updateQueryParams, deleteQueryParam} from '../../router.js';
import {ModelEventsMixin} from '../../helpers/react_mixins.js';

/* \--------------------------------------------------------------------------------------------/
 *                    DESCRIPTION component
 * /--------------------------------------------------------------------------------------------\ */
export default React.createClass({
    render: function () {
        return (
            <main className='description'>
                <ul className='features-list'>
                    <li>Full stack</li>
                    <li>Next generation ES6</li>
                    <li>Gulp build proccess</li>
                    <li>Front end testing using Phantom.js and Karma.js</li>
                    <li>Back end testing using mocha.js</li>
                    <li>Front end NPM modules using Browserify</li>
                </ul>
            </main>
        );
    }
});
