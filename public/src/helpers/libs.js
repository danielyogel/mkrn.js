import React from 'react/addons';
import _ from 'ramda';
import reqwest from 'reqwest'; // <-- TODO not working with phantomjs ?? something about requiring react ....
import events from 'events';
import queryString from 'query-string';
import objectAssign from 'object-assign';

var eventEmitter = new events.EventEmitter();

/* \-----------------------------------------------/
 *                    EXPORTS
 * /-----------------------------------------------\ */
export {React, _, reqwest, eventEmitter, queryString, objectAssign};


