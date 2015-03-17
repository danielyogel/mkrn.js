// imports
import { koaRouter, _ } from '../../helpers/libs.js';
import {signUp, logOut, logIn, isLogged, deleteUser, updateUser} from './auth_routes';


var items = [
    {
        id: 1,
        name: 'Daniel',
        age: '31'
    },
    {
        id: 2,
        name: 'Guy',
        age: 12
    },
    {
        id: 3,
        name: 'moshe',
        age: 33
    }
];

export default function configureApp(app) {
    app.use(koaRouter(app));

    // auth
    app.post('/signup', signUp);
    app.post('/logout', logOut);
    app.post('/login', logIn);
    app.get('/isLoggedIn', isLogged);
    app.post('/deleteuser', deleteUser);
    app.post('/updateuser', updateUser);


    // items
    app.get('/items', function* () {
        this.body = items;
    });

    app.delete('/items/:id', function* () {
        var init_length = items.length;
        console.log('param in route is: ' + this.params.id);
        items.splice(this.params.id, 1);
        var end_length = items.length;
        if (init_length === (end_length + 1)) {
            this.body = {
                succes: true,
                items: items
            };
        } else {
            this.body = {
                success: false,
                items: items
            };
        }
    });
}


