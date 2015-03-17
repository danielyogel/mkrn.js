import React from 'react/addons';
import _ from 'ramda';
import reqwest from 'reqwest';
import events from 'events';
import queryString from 'query-string';
import objectAssign from 'object-assign';
import mui from 'material-ui';
import injectTapEventPlugin from "react-tap-event-plugin";

var eventEmitter = new events.EventEmitter();

/* \-----------------------------------------------/
 *                    EXPORTS
 * /-----------------------------------------------\ */
export { React, _, reqwest, eventEmitter, queryString, objectAssign, mui , injectTapEventPlugin };


