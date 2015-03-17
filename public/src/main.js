//libs
import {  _, reqwest, eventEmitter, injectTapEventPlugin } from './helpers/libs.js';
import React from 'react';
import mui from 'material-ui';
injectTapEventPlugin();

// Components
import Header                              from './components/Header/Header.js';
import MainSelector                        from './components/MainSelector/MainSelector.js';

// main component
var App = React.createClass({
    render: function () {
        return (
            <div className='site-body'>
                <MainSelector/>
            </div>
        );
    }
});


// init
React.render(<App/>, document.body);



