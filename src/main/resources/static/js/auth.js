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

    actualizarMenu() {
        const estaLogueado = this.estaAutenticado();
        const rolRaw = this.obtenerRol();

        const navAuth = document.getElementById('nav-auth-links');
        const navUser = document.getElementById('nav-user-links');
        const linkAdmin = document.getElementById('navAdmin');
        const linkMisTickets = document.getElementById('navMisTickets');

        // Mostramos/ocultamos bloques generales
        if (navAuth) navAuth.style.display = estaLogueado ? 'none' : 'flex';
        if (navUser) navUser.style.display = estaLogueado ? 'flex' : 'none';

        if (estaLogueado && rolRaw) {
            const rol = rolRaw.toUpperCase();
            const esVendedor = rol.includes('VENDEDOR');

            // --- CORRECCIÓN DE NAVEGACIÓN ---
            // 1. El panel de vendedor solo sale si es VENDEDOR
            if (linkAdmin) linkAdmin.style.display = esVendedor ? 'block' : 'none';

            // 2. "Mis Tickets" ahora sale SIEMPRE que estés logueado (seas vendedor o cliente)
            if (linkMisTickets) linkMisTickets.style.display = 'block';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Auth.actualizarMenu();

    // --- LÓGICA PARA EL MENÚ MÓVIL ---
    // Añadimos un listener para el botón de hamburguesa que pondremos en el HTML
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});