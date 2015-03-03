// imports
import {koaRouter} from '../../helpers/libs.js';
import {signUp, logOut, logIn, isLogged, deleteUser, updateUser} from './auth_routes';


export default function configureApp(app) {
    app.use(koaRouter(app));

    // auth
    app.post('/signup', signUp);
    app.post('/logout', logOut);
    app.post('/login', logIn);
    app.get('/isLoggedIn', isLogged);
    app.post('/deleteuser', deleteUser);
    app.post('/updateuser', updateUser);
}


