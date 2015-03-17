// imports
import reqwest from 'reqwest';

/* \-----------------------------------------------/
 *                    User API
 * /-----------------------------------------------\ */
export function fetchAllItems() {
    return reqwest({
        url: '/items',
        method: 'get'
    });
}
