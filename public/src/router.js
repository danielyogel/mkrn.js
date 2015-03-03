//libs
import {queryString} from './helpers/libs.js';
import {forEach, merge, call} from 'ramda';


// init router
var queryListeners = [];
var old_query_obj = queryString.parse(location.search);
window.onpopstate = (e) => forEach(call, queryListeners);

//  on pushstate router
export function queryRouter(param_name, handler) {
    queryListeners.push(() => {
        var new_query_obj = queryString.parse(location.search);
        if (old_query_obj[param_name] !== new_query_obj[param_name]) {
            console.log(param_name + ' query param changes on pushstate, calling handler !');
            handler(new_query_obj[param_name]);
            old_query_obj = new_query_obj;
        }
    })
}

//  update query params helpers
export function updateQueryParams(updatesObj) {
    var original_query_obj = queryString.parse(location.search);
    var new_path = queryString.stringify(merge(original_query_obj, updatesObj));
    history.pushState(null, null, '/?' + new_path);
    old_query_obj = queryString.parse(location.search);
}

export function deleteQueryParam(param) {
    var new_query_string = (() => {
        if (param === 'all') {
            return '';
        } else {
            var original_query_obj = queryString.parse(location.search);
            delete original_query_obj[param];
            return queryString.stringify(original_query_obj) ? '?' + queryString.stringify(original_query_obj) : '';
        }
    })();
    history.pushState(null, null, '/' + new_query_string);
    old_query_obj = queryString.parse(location.search);
}


