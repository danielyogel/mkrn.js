import _ from 'ramda';
import reqwest from 'reqwest';
import events from 'events';
import queryString from 'query-string';
import objectAssign from 'object-assign';
import injectTapEventPlugin from "react-tap-event-plugin";

var eventEmitter = new events.EventEmitter();

/* \-----------------------------------------------/
 *                    EXPORTS
 * /-----------------------------------------------\ */
export {  _, reqwest, eventEmitter, queryString, objectAssign,  injectTapEventPlugin };


