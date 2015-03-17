//libs
import { React, _, reqwest , eventEmitter } from '../../helpers/libs.js';
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
                    <h2 className="site-header__description"> Mongo, Koa, React, Node.</h2>
                </h1>

            </header>
        );
    }
});
