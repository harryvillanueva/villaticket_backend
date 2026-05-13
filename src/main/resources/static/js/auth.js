// js/auth.js
const Auth = {
    TOKEN_KEY: 'villaticket_token',
    EMAIL_KEY: 'villaticket_email',
    ROLE_KEY: 'villaticket_role',

    estaAutenticado() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        return token !== null && token !== undefined && token !== 'null' && token !== '';
    },

    obtenerToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    obtenerEmail() {
        return localStorage.getItem(this.EMAIL_KEY);
    },

    obtenerRol() {
        const rol = localStorage.getItem(this.ROLE_KEY);
        if (rol === 'undefined' || !rol) return null;
        return rol;
    },

    cerrarSesion() {
        localStorage.clear();
        window.location.href = 'login.html';
    },

    async actualizarMenu() {
        const estaLogueado = this.estaAutenticado();
        const navAuth = document.getElementById('nav-auth-links');
        const navUser = document.getElementById('nav-user-links');
        const linkAdmin = document.getElementById('navAdmin');
        const imgMenu = document.getElementById('userAvatarMenu');

        if (navAuth) navAuth.style.display = estaLogueado ? 'none' : 'flex';
        if (navUser) navUser.style.display = estaLogueado ? 'flex' : 'none';

        if (estaLogueado) {
            const rolRaw = this.obtenerRol();
            if (rolRaw && linkAdmin) {
                const rol = rolRaw.toUpperCase();
                linkAdmin.style.display = rol.includes('VENDEDOR') ? 'block' : 'none';
            }

            // Cargamos la foto de perfil si existe el elemento en el HTML
            if (imgMenu) {
                try {
                    const perfil = await fetchAPI('/users/profile', 'GET');
                    if (perfil.urlAvatar) {
                        imgMenu.src = perfil.urlAvatar;
                        imgMenu.style.display = 'block';
                    }
                } catch (e) { console.warn("No se pudo cargar avatar en menú"); }
            }
        }
    }
};

// --- SOLUCIÓN AL REFERENCE ERROR: Lo hacemos explícitamente global ---
window.Auth = Auth;

document.addEventListener('DOMContentLoaded', () => {
    Auth.actualizarMenu();

    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }
});