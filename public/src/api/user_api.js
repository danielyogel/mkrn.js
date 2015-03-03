// imports
import reqwest from 'reqwest';

/* \-----------------------------------------------/
 *                    User API
 * /-----------------------------------------------\ */
export function signUp(infoObj) {
    return reqwest({
        url: '/signup',
        method: 'post',
        data: infoObj
    })

}

export function login(infoObj) {
    return reqwest({
        url: '/login',
        method: 'post',
        data: infoObj
    })
}

export function logOut() {
    return reqwest({
        url: '/logout',
        method: 'post'
    })
}

export function isLoggedIn() {
    return reqwest({
        url: '/isLoggedIn',
        method: 'get'
    })
}

export function update(old_password, updatesObj) {
    return reqwest({
        url: '/updateuser',
        method: 'post',
        data: {password: old_password, updates: updatesObj}
    })
}

export function deleteUser(password) {
    return reqwest({
        url: '/deleteuser',
        method: 'post',
        data: {password: password}
    })
}

