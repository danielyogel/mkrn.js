//libs
import {  _, reqwest , eventEmitter } from '../../../helpers/libs.js';
import React from 'react';
import mui from 'material-ui';
// router
import { updateQueryParams, deleteQueryParam } from '../../../router.js';
// mixins
import { ModelEventsMixin } from '../../../helpers/react_mixins.js';
// Components
var { map } = _;
var { Menu, RaisedButton } = mui;

/* \--------------------------------------------------------------------------------------------/
 *                    ItemsList component
 * /--------------------------------------------------------------------------------------------\ */
export default React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        var html_list = map((person) => <li key={person.id}> id: {person.id}, name: {person.name}, age: {person.age}
            <RaisedButton label ='delete' primary={true}/>
        </li>, this.props.items);
        return (
            <div className='items-list'>
                <ul> {html_list} </ul>
            </div>

        );
    }
});
