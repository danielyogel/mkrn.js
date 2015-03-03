// imports
import {mongoose, bcrypt, Promise,  merge, identity} from '../../helpers/libs.js';
import configs from '../../configs.js';
import {throwClientError} from '../../helpers/errors.js';

// User schema
var UserSchema = new mongoose.Schema({
    email: {
        required: true,
        unique: true,
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {type: String, required: true},
    private_name: {type: String, required: true},
    last_name: {type: String}
});
var User = Promise.promisifyAll(mongoose.model('User', UserSchema));

// exports
export function* hash_then_save_user(new_user) {
    if (new_user.password.length < 7 || new_user.password.length > 10) throwClientError(400, 'password length should be between 7 and 10');
    var hashed_password = yield hash_password(new_user.password);
    var hashed_new_user = merge(new_user, {password: hashed_password});
    try {
        return yield User.createAsync(hashed_new_user).then(createdUser => {
            delete createdUser._doc._id;
            delete createdUser._doc.__v;
            delete createdUser._doc.password;
            return createdUser._doc;
        });
    } catch (err) {
        if (err.errors && err.errors.email)                         throwClientError(400, err.errors.email.path + ' ' + err.errors.email.type);
        if (err.cause && err.cause.err.indexOf('duplicate') !== -1) throwClientError(400, 'duplicate email');
        if (err.errors && err.errors.private_name)                  throwClientError(400, err.errors.private_name.path + ' ' + err.errors.private_name.type);
        throw err;
    }
}

export function* compare_user_password(email, password) {
    var user_from_db = yield User.findOneAsync({email: email});
    if (user_from_db === null) throwClientError(400, 'email does not exist in db');
    var result = yield compare_password(password, user_from_db.password);
    if (result) return {compared_user: user_from_db};
    throwClientError(400, 'password does not much');
}

export function* update_user(email, password, updates_obj) {
    var result = yield compare_user_password(email, password);
    var user_from_db = result.compared_user;
    if (updates_obj.email) user_from_db.email = updates_obj.email;
    if (updates_obj.password) user_from_db.password = updates_obj.password;
    if (updates_obj.private_name) user_from_db.private_name = updates_obj.private_name;
    if (updates_obj.last_name) user_from_db.last_name = updates_obj.last_name;
    return yield new Promise((resolve, reject) => {
        user_from_db.save((err, user)=> {
            if (err) return reject(err);
            delete user._doc._id;
            delete user._doc.__v;
            return resolve({updated_user: user});
        });
    });
}

export function* delete_user(email, password) {
    yield compare_user_password(email, password);
    yield User.findOneAndRemoveAsync({email: email});
    return {success: 'user deleted'};
}

export { User };
export function deleteAllUsers() {
    if (configs.env === 'prod') return identity;
    return User.removeAsync();
}

// helpers
function hash_password(new_password) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return reject(err);
            bcrypt.hash(new_password, salt, function (err, hash) {
                if (err) return reject(err);
                return resolve(hash);
            });
        });
    });
}

function compare_password(password, hash) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, hash, function (err, res) {
            if (err) return reject(err);
            return resolve(res);
        });
    });
}