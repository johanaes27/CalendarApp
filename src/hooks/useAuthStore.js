import { useDispatch, useSelector } from "react-redux"
import {calendarApi} from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store";


export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async({ email, password }) =>{

        dispatch( onChecking() )

        try {     
    
            const { data } = await calendarApi.post('/auth', { email, password } );
            console.log(data);
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid  }) );


        } catch (error) {

            dispatch( onLogout('Usuario o contraseña incorrectos ') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);      
        }
    }

    // StartRegister  //si el registro es exitoso se dispacha onlogin authslice. Endpoint es auth crear usuario postman, mandar misma data, y arreglar error usuario ya existe
    const startRegister = async({ name, email, password }) =>{

        dispatch( onChecking() )

        try {     
    
            const { data } = await calendarApi.post('/auth/new', { name, email, password } );
            localStorage.setItem('token', data.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid  }) );


        } catch (error) {
            dispatch( onLogout( error.response.data?.msg || '--' ) );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);      
        }
    }

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch ( onLogout() )
    

         try {
        const { data } = await calendarApi.get('auth/renew')
        localStorage.setItem('token', data.token );
        localStorage.setItem('token-init-date', new Date().getTime() );
        dispatch( onLogin({ name: data.name, uid: data.uid  }) );

        } catch (error) {
            localStorage.clear()
            return dispatch ( onLogout() )
    }

    }

    const startLogout = () => {
        localStorage.clear();
        dispatch(onLogout());
    }

    return{
        // * Propiedades
        errorMessage,
        status,
        user,
        
        //* Metodos 
        checkAuthToken,
        startLogin,
        startLogout,
        startRegister
    }


}