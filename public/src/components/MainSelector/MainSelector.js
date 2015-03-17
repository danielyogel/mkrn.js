//libs
import {  _ } from '../../helpers/libs.js';
import mui from 'material-ui';
import React from 'react';
// router
import { updateQueryParams, deleteQueryParam } from '../../router.js';
// mixins
import { ModelEventsMixin } from '../../helpers/react_mixins.js';
// api
import { fetchAllItems } from '../../api/items_api.js';
// Components
import ItemsList from './ItemsList/ItemsList.js';
import CreateForm from './CreateForm/CreateForm.js';
var {RaisedButton, Paper} = mui;


/* \--------------------------------------------------------------------------------------------/
 *                    MainSelector component
 * /--------------------------------------------------------------------------------------------\ */
export default React.createClass({
    getInitialState: function () {
        return {
            items: [],
            selected: 'list'
        };
    },
    componentDidMount: function () {
        fetchAllItems()
            .then((res) => {
                this.setState({
                    items: res
                }, () => {
                    //console.dir(this.state.items);
                });
            });
    },
    toggleView: function () {
        var selected = this.state.selected === 'list' ? 'create' : 'list';
        this.setState({
            selected: selected
        });
    },
    render: function () {
        var SelectedForm = (() => {
            switch (this.state.selected) {
                case 'list':
                    return ItemsList;
                    break;
                case 'create':
                    return CreateForm;
                    break;
                default:

            }
        })();
        return (
            <div className='main-selector'>
                <header className='main-selector__header clearfix'>
                    <h1 className='third'> Please select a view: </h1>
                    <div className="third">
                        <RaisedButton label='Items list' secondary={true} onClick={this.toggleView} />
                    </div>
                    <div className="third">
                        <RaisedButton label='Create new item' secondary={true} onClick={this.toggleView}/>
                    </div>
                </header>
                <SelectedForm items= { this.state.items }/>
            </div>
        );
    }
});
