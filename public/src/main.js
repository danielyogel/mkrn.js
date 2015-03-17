//libs
import { React, _, reqwest, eventEmitter, mui, injectTapEventPlugin } from './helpers/libs.js';
injectTapEventPlugin();

// Components
import Header                              from './components/Header/Header.js';

// main component
var App = React.createClass({
    render: function () {
        return (
            <div className='site-body'>
                <Header/>
            </div>
        );
    }
});


// init
React.render(<App/>, document.body);



