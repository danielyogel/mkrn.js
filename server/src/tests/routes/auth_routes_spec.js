// imports
import { expect, merge, request,  _} from '../../helpers/libs.js';
import log from '../../helpers/loggers.js';
import app from '../../app/app.js';
import {User, deleteAllUsers} from '../../app/db/user.js';


// tests
var agent = request.agent(app.listen());

describe('auth routes', ()=> {
    beforeEach(function* () {
        yield deleteAllUsers();
        var res = yield agent.post('/logout').end();
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({success: true});
    });

    describe('/POST /signup', () => {
        it('200 {savedUserObj} --> session.email is assigned, when valid arguments', function* () {
            // assert session state before code
            var res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);
            // run code
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(_.omit(['password'], user_to_save));
            //console.log(res.body);
            // assert session state after code
            res = yield agent.get('/isloggedin').end();
            console.dir(res.body.logged);
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));
        });
        it('400 {failure: "duplicate email"}, when username already taken', function* () {
            // assert session state before code
            var res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);
            // run code
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({email: user_to_save.email, private_name: user_to_save.private_name, last_name: user_to_save.last_name});
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));
            // run code again
            res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(400);
            expect(res.body).to.deep.equal({failure: 'duplicate email'});
            // assert session state after code
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));
        });
    });
    describe('/POST /login', ()=> {
        it('200 {loggedUserObj} -> session.email is assigned, when provided valid email and password', function*() {
            // create a user and log out
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            var res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({email: user_to_save.email, private_name: user_to_save.private_name, last_name: user_to_save.last_name});
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));
            res = yield agent.post('/logout').end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({success: true});
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);

            // run code - log in
            res = yield agent.post('/login').send({email: user_to_save.email, password: user_to_save.password}).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(_.omit(['password'], user_to_save));
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));
        });
        it('400 {failure: password does not much}, when provided non valid  password', function*() {
            // create a user and log out
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            var res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({email: user_to_save.email, private_name: user_to_save.private_name, last_name: user_to_save.last_name});
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));
            res = yield agent.post('/logout').end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({success: true});
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);

            // run code - log in
            res = yield agent.post('/login').send({email: user_to_save.email, password: user_to_save.password + 'ZZ'}).end();
            expect(res.status).to.equal(400);
            expect(res.body).to.deep.equal({failure: 'password does not much'});
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);
        });
        it('400 {failure: email does not exist}, when provided email that does not exist', function*() {
            // create a user and log out
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            var res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);

            // run code - log in
            res = yield agent.post('/login').send({email: user_to_save.email, password: user_to_save.password}).end();
            expect(res.status).to.equal(400);
            expect(res.body).to.deep.equal({failure: 'email does not exist in db'});
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);
        });
    });
    describe('/POST /logout', ()=> {
        it('200 {success: true} -> session.email = null, always', function* () {
            // assert session state before code
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);
            // create a user
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({email: user_to_save.email, private_name: user_to_save.private_name, last_name: user_to_save.last_name});
            // assert session state after code
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));

            /* log out*/
            var res = yield agent.post('/logout').end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({success: true});

            // assert session state after code
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);
        });
    });
    describe('/POST /deleteuser', () => {
        it('200 {success: true} -> session.email = null, when already logged and sent valid password', function*() {
            // SETUP
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            var res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({email: user_to_save.email, private_name: user_to_save.private_name, last_name: user_to_save.last_name});
            // assert session state after code
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));
            // assert user in db
            var userFromDb = yield User.findOneAsync({email: user_to_save.email});
            expect(userFromDb.email).to.equal(user_to_save.email);

            //RUN CODE
            res = yield agent.post('/deleteuser').send({password: user_to_save.password}).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({success: true});

            //SERVER ASSERT
            // assert session state after code
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);
            // assert user in db
            userFromDb = yield User.findOneAsync({email: user_to_save.email});
            expect(userFromDb).to.equal(null);
        });
        it('400 {failure: password does not much} , when password not valid', function*() {
            // SETUP
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            var res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({email: user_to_save.email, private_name: user_to_save.private_name, last_name: user_to_save.last_name});
            // assert session state after code
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));
            // assert user in db
            var userFromDb = yield User.findOneAsync({email: user_to_save.email});
            expect(userFromDb.email).to.equal(user_to_save.email);

            //RUN CODE
            res = yield agent.post('/deleteuser').send({password: user_to_save.password + 'ZZ'}).end();
            expect(res.status).to.equal(400);
            expect(res.body).to.deep.equal({failure: 'password does not much'});

            //SERVER ASSERT
            // assert session state after code
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));
            // assert user in db
            userFromDb = yield User.findOneAsync({email: user_to_save.email});
            expect(userFromDb.email).to.equal(user_to_save.email);
        });
        it('400 {failure: user not logged in} , when not already logged in', function*() {
            // SETUP
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            var res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({email: user_to_save.email, private_name: user_to_save.private_name, last_name: user_to_save.last_name});
            // assert session state after code
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.deep.equal(_.omit(['password'], user_to_save));
            res = yield agent.post('/logout').end();
            expect(res.body.success).to.equal(true);
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);
            // assert user in db
            var userFromDb = yield User.findOneAsync({email: user_to_save.email});
            expect(userFromDb.email).to.equal(user_to_save.email);

            //RUN CODE
            res = yield agent.post('/deleteuser').send({password: user_to_save.password + 'ZZ'}).end();
            expect(res.status).to.equal(400);
            expect(res.body).to.deep.equal({failure: 'user not logged in'});

            //SERVER ASSERT
            //assert session state after code
            res = yield agent.get('/isloggedin').end();
            expect(res.body.logged).to.equal(false);
            //assert user in db
            userFromDb = yield User.findOneAsync({email: user_to_save.email});
            expect(userFromDb.email).to.equal(user_to_save.email);
        });
    });

    describe('/POST /updateuser', () => {
        it('200 {updatedUserObj}, when password is valid', function* () {
            // SETUP
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            var res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(_.omit(['password'], user_to_save));

            // RUN CODE
            res = yield agent.post('/updateuser').send({password: user_to_save.password, updates: {private_name: 'new name'}}).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(_.merge(_.omit(['password'], user_to_save), {private_name: 'new name'}));
        });
        it('400 {failure: user not logged in}', function* () {
            // SETUP
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            var res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(_.omit(['password'], user_to_save));
            //logout
            res = yield agent.post('/logout').end();
            expect(res.status).to.equal(200);
            // RUN CODE
            res = yield agent.post('/updateuser').send({password: user_to_save.password, updates: {private_name: 'new name'}}).end();
            expect(res.status).to.equal(400);
            expect(res.body).to.deep.equal({failure: 'user not logged in'});
        });
        it('400 {failure: password does not much}', function* () {
            // SETUP
            var user_to_save = {email: 'valid@email.com', password: '123456789', private_name: 'joe', last_name: 'cohen'};
            var res = yield agent.post('/signup').send(user_to_save).end();
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(_.omit(['password'], user_to_save));
            // RUN CODE
            res = yield agent.post('/updateuser').send({password: user_to_save.password + 'ZZ', updates: {private_name: 'new name'}}).end();
            expect(res.status).to.equal(400);
            expect(res.body).to.deep.equal({failure: 'password does not much'});
        });
    });
    /*
     * TODO
     *
     * 1- check out other apps examples.
     * 2- finish this route
     * 3- check how sessions work... what in the cookie itself...
     * 4- how to delete a session. is it still new ?
     *
     * */
});
