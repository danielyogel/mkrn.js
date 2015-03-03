//libs
import {React, _, reqwest, eventEmitter} from '../../helpers/libs.js';
import Header      from '../Header/Header.js';
import Description      from '../Description/Description.js';

/* \-----------------------------------------------/
 *                APP Component
 * /-----------------------------------------------\ */
export default  React.createClass({
    render: function () {
        return (
            <div className='site-body'>
                <Header/>
                <Description/>
            </div>
        );
    }
});
