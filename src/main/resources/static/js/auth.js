// js/auth.js
const TOKEN_KEY = 'villaticket_jwt';
const USER_ROLE_KEY = 'villaticket_role';

const Auth = {
    guardarSesion: (token, rol, email) => { // Añadido el email
            localStorage.setItem(TOKEN_KEY, token);
            if (rol) localStorage.setItem(USER_ROLE_KEY, rol);
            if (email) localStorage.setItem('villaticket_email', email); // Guardamos el email
        },

    obtenerToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    obtenerRol: () => {
        return localStorage.getItem(USER_ROLE_KEY);
    },

    cerrarSesion: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_ROLE_KEY);
        window.location.href = 'login.html';
    },

    estaAutenticado: () => {
        return !!localStorage.getItem(TOKEN_KEY);
    }
};