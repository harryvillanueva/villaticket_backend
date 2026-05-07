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

    obtenerRol() {
        return localStorage.getItem(this.ROLE_KEY);
    },

    cerrarSesion() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.EMAIL_KEY);
        localStorage.removeItem(this.ROLE_KEY);
        window.location.href = 'login.html';
    },

    /**
     * Gestiona la visibilidad del menú de forma segura.
     * Si un ID no existe en el HTML de la página actual, el código no se rompe.
     */
    actualizarMenu() {
        const estaLogueado = this.estaAutenticado();
        const rol = this.obtenerRol();

        // Buscamos los elementos por ID
        const linkLogin = document.getElementById('navLogin');
        const linkRegistro = document.getElementById('navRegistro');
        const linkLogout = document.getElementById('navLogout');
        const linkMisTickets = document.getElementById('navMisTickets');
        const linkAdmin = document.getElementById('navAdmin');

        // Aplicamos cambios solo si el elemento existe en el DOM actual
        if (linkLogin) linkLogin.style.display = estaLogueado ? 'none' : 'block';
        if (linkRegistro) linkRegistro.style.display = estaLogueado ? 'none' : 'block';
        if (linkLogout) linkLogout.style.display = estaLogueado ? 'block' : 'none';

        if (linkMisTickets) {
            linkMisTickets.style.display = estaLogueado ? 'block' : 'none';
        }

        if (linkAdmin) {
            // Verificamos que sea VENDEDOR (en mayúsculas como viene del backend)
            linkAdmin.style.display = (estaLogueado && rol === 'VENDEDOR') ? 'block' : 'none';
        }
    }
};

// Se ejecuta automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    Auth.actualizarMenu();
});