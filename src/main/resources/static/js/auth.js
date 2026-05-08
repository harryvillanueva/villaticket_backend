const Auth = {
    // Definición de las llaves exactas con las que guardamos los datos en login.js
    TOKEN_KEY: 'villaticket_token',
    EMAIL_KEY: 'villaticket_email',
    ROLE_KEY: 'villaticket_role',

    /**
     * Verifica si existe una sesión válida comprobando el token.
     */
    estaAutenticado() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        // Retorna true solo si hay un token válido (ignora los nulos o vacíos)
        return token !== null && token !== undefined && token !== 'null' && token !== '';
    },

    /**
     * Devuelve el Token JWT actual.
     * Fundamental para que fetch() pueda pedir datos protegidos a Spring Boot.
     */
    obtenerToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    /**
     * Devuelve el email del usuario logueado.
     */
    obtenerEmail() {
        return localStorage.getItem(this.EMAIL_KEY);
    },

    /**
     * Devuelve el rol asegurándose de ignorar la palabra "undefined" si ocurriera un error.
     */
    obtenerRol() {
        const rol = localStorage.getItem(this.ROLE_KEY);
        if (rol === 'undefined' || !rol) return null;
        return rol;
    },

    /**
     * Cierra la sesión eliminando todo el rastro en el navegador y manda al login.
     */
    cerrarSesion() {
        localStorage.clear();
        window.location.href = 'login.html';
    },

    /**
     * Dibuja y oculta las partes del menú según quién esté navegando.
     */
    actualizarMenu() {
        const estaLogueado = this.estaAutenticado();
        const rolRaw = this.obtenerRol();

        // Línea de depuración para la consola
        console.log("🔍 Verificando Menú:", { estaLogueado, rol: rolRaw });

        // Identificamos todos los botones y secciones del menú en el HTML
        const navAuth = document.getElementById('nav-auth-links'); // Iniciar Sesión / Registro
        const navUser = document.getElementById('nav-user-links'); // Contenedor para logueados
        const linkAdmin = document.getElementById('navAdmin');     // Panel Vendedor
        const linkMisTickets = document.getElementById('navMisTickets'); // Mis Tickets

        // Lógica de visibilidad general
        if (navAuth) navAuth.style.display = estaLogueado ? 'none' : 'flex';
        if (navUser) navUser.style.display = estaLogueado ? 'flex' : 'none';

        // Lógica específica basada en el Rol
        if (estaLogueado && rolRaw) {
            // Pasamos a mayúsculas para evitar errores tipográficos
            const rol = rolRaw.toUpperCase();
            const esVendedor = rol.includes('VENDEDOR');

            // El Dashboard solo se muestra si el usuario es Vendedor
            if (linkAdmin) linkAdmin.style.display = esVendedor ? 'block' : 'none';

            // Los clientes ven sus tickets
            if (linkMisTickets) linkMisTickets.style.display = esVendedor ? 'none' : 'block';
        }
    }
};

// Autoejecutar la función del menú cada vez que se carga un HTML
document.addEventListener('DOMContentLoaded', () => {
    Auth.actualizarMenu();
});