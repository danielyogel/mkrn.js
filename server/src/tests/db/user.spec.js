// imports
import {Promise, expect, merge} from '../../helpers/libs.js';
import log from '../../helpers/loggers.js';
import { hash_then_save_user, compare_user_password, update_user, delete_user, deleteAllUsers, User } from '../../app/db/user.js';

// tests
describe('db/user.js', () => {
    beforeEach(function* () {
        yield deleteAllUsers();
    });
    describe('hash_then_save_user', () => {
        it('succeed to save a user when given valid obj', function*() {
            var new_user = {
                email: 'valid@email.com',
                password: '123456789',
                private_name: 'daniel'
            };
            yield hash_then_save_user(new_user);
        });
        it("throws 400 email regexp , when given non valid email", function*() {
            var new_user = {
                email: 'xxxxxxxxxxxxxxxxx',
                password: '1234567',
                private_name: 'daniel'
            };
            try {
                yield hash_then_save_user(new_user);
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('email regexp');
            }
        });
        it("throws 400 email required, when missing email", function*() {
            var new_user = {
                password: '1234567',
                private_name: 'daniel'
            };
            try {
                yield hash_then_save_user(new_user);
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('email required');
            }
        });
        it("throws 400 private_name required, when private_name is missing", function*() {
            var new_user = {
                email: 'valid@email.com',
                password: '12345678'
            };
            try {
                yield hash_then_save_user(new_user);
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('private_name required');
            }
        });
        it("throws 400 password length should be between 7 and 10, when password is too short", function*() {
            var new_user = {
                email: 'valid@email.com',
                password: '123456',
                private_name: 'daniel'
            };
            try {
                yield hash_then_save_user(new_user);
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('password length should be between 7 and 10');
            }
        });
        it("throws 400 duplicate email, when given duplicate email", function*() {
            var new_user = {
                email: 'valid@email.com',
                password: '123456789',
                private_name: 'daniel'
            };
            yield hash_then_save_user(new_user);
            try {
                yield hash_then_save_user(new_user);
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('duplicate email');
            }
        });
    });
    describe('compare_user_password', ()=> {
        it('returns {result: compared_userObj} when password is the same as hashed-password from db', function* () {
            var new_user = {
                email: 'valid@email.com',
                password: '123456789',
                private_name: 'daniel'
            };
            yield hash_then_save_user(new_user);
            var result = yield compare_user_password(new_user.email, new_user.password);
            expect(result.compared_user).to.be.instanceOf(Object);
            expect(result.compared_user.email).to.equal('valid@email.com');
        });
        it("throws 400 password does not much the hash, when password is not the same as hashed-password from db", function* () {
            var new_user = {
                email: 'valid@email.com',
                password: '123456789',
                private_name: 'daniel'
            };
            yield hash_then_save_user(new_user);
            try {
                yield compare_user_password(new_user.email, new_user.password + 'ZZ');
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('password does not much');
            }
        });
        it("throws 400 email does not exist in db, when provided with wrong email", function* () {
            var new_user = {
                email: 'valid@email.com',
                password: '123456789',
                private_name: 'daniel'
            };
            yield hash_then_save_user(new_user);
            try {
                yield compare_user_password(new_user.email + 'ZZ', new_user.password);
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('email does not exist in db');
            }
        });
    });
    describe('update_user', ()=> {
        it('{result: updated_user}, when all arguments are ok', function* () {
            var new_user = {
                email: 'valid@email.com',
                password: '123456789',
                private_name: 'daniel'
            };
            yield hash_then_save_user(new_user);
            var updates_obj = {
                password: 'zzzzzzzz'
            };
            var result = yield update_user(new_user.email, new_user.password, updates_obj);
            expect(result.updated_user).to.be.instanceOf(Object);
            var expected_updated_user = merge(new_user, updates_obj);
            expect(result.updated_user._doc).to.deep.equal(expected_updated_user);
        });
        it("throws 400 password does not much the hash, when password is wrong", function* () {
            var new_user = {
                email: 'valid@email.com',
                password: '123456789',
                private_name: 'daniel'
            };
            yield hash_then_save_user(new_user);
            try {
                yield update_user(new_user.email, new_user.password + 'ZZ', {email: 'zzz@zzz.com'});
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('password does not much');
            }
        });
        it('throws 400 email does not exist in db, when email is not saved in db', function* () {
            var new_user = {
                email: 'valid@email.com',
                password: '123456789',
                private_name: 'daniel'
            };
            yield hash_then_save_user(new_user);
            try {
                var result = yield update_user(new_user.email + 'ZZ', new_user.password, {email: 'zzz@zzz.com'});
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('email does not exist in db');
            }
        });
    });
    describe('delete_user', ()=> {
        it('"user deleted", when all arguments are ok', function* () {
            var new_user = {
                email: 'valid@email.com',
                password: '123456789',
                private_name: 'daniel'
            };
            yield hash_then_save_user(new_user);
            var user_from_db = yield User.findOneAsync({email: new_user.email});
            expect(user_from_db).to.not.equal(null);
            var res = yield delete_user(new_user.email, new_user.password);
            expect(res).to.deep.equal({success: 'user deleted'});
            var deleted_user_res = yield User.findOneAsync({email: new_user.email});
            expect(deleted_user_res).to.equal(null);
        });
        it("throws 400 email does not exist in db, when user does not exist", function* () {
            try {
                yield delete_user('zzzz@asdw.con', '123456789');
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('email does not exist in db');
            }
        });
        it("throws 400 password does not much, when password does not much", function* () {
            var new_user = {
                email: 'valid@email.com',
                password: '123456789',
                private_name: 'daniel'
            };
            yield hash_then_save_user(new_user);
            var user_from_db = yield User.findOneAsync({email: new_user.email});
            expect(user_from_db).to.not.equal(null);
            try {
                yield delete_user(new_user.email, new_user.password + 'ZZ');
            } catch (err) {
                expect(err.status).to.equal(400);
                expect(err.message).to.equal('password does not much');
            }
            var deleted_user_res = yield User.findOneAsync({email: new_user.email});
            expect(deleted_user_res).to.not.equal(null);
        });
    });
});
