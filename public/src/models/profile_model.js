// libs
import {  reqwest , eventEmitter, objectAssign } from '../helpers/libs.js';
import { signUp as sendSignUp, logOut as sendLogOut, isLoggedIn as sendIsLoggedIn } from '../api/user_api.js';

// state
export var state = {
    user: '',
    sidebar_is_open: false,
    profile_form: 'login'
};

// init
sendIsLoggedIn()
    .then(res => {
        if (res.logged) saveUser(res.logged)
    });

// actions
export function handleToggleSidebar(e) {
    updateStateAndEmit({
        sidebar_is_open: !state.sidebar_is_open
    });
}

export function saveUser(userObj) {
    updateStateAndEmit({
        user: userObj
    })
}

export function handleLogOut() {
    sendLogOut();
    updateStateAndEmit({
        user: '',
        sidebar_is_open: false,
        profile_form: 'login'
    });
}

export function handleChangeForm() {
    updateStateAndEmit({
        profile_form: state.profile_form === 'login' ? 'signup' : 'login'
    });
}

// helpers
function updateStateAndEmit(updatesObj) {
    objectAssign(state, updatesObj);
    eventEmitter.emit('profile_model_update');
}
