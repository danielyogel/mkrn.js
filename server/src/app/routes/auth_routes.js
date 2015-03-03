// imports
import {omit, pick} from '../../helpers/libs.js';
import {hash_then_save_user, delete_user, update_user, User, compare_user_password} from '../db/user.js';

// auth handlers
export function* signUp() {
    var result = yield hash_then_save_user(this.request.body);
    this.session.$set('email', result.email);
    this.body = result;
}
export function* logIn() {
    var result = yield compare_user_password(this.request.body.email, this.request.body.password);
    this.session.$set('email', result.compared_user._doc.email);
    this.body = pick(['email', 'last_name', 'private_name'], result.compared_user._doc);
}

export function* logOut() {
    this.session = null;
    this.body = {success: true};
}

export function* isLogged() {
    if (this.session && this.session.email) {
        var user_from_db = yield User.findOneAsync({email: this.session.email});
        this.body = {logged: omit(['password', '_id', '__v'], user_from_db._doc)};
    } else {
        this.body = {logged: false}
    }
}

export function* deleteUser() {
    if (!this.session.email) this.throw(400, 'user not logged in');
    yield delete_user(this.session.email, this.request.body.password);
    this.session = null;
    this.body = {success: true};
}


export function* updateUser() {
    if (!this.session.email) this.throw(400, 'user not logged in');
    var res = yield update_user(this.session.email, this.request.body.password, this.request.body.updates);
    this.session.$set('email', res.updated_user._doc.email);
    this.body = omit(['password'], res.updated_user._doc);
}
