// js/index.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo dinámico del Navbar según autenticación
    const authLinks = document.getElementById('nav-auth-links');
    const userLinks = document.getElementById('nav-user-links');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    if (Auth.estaAutenticado()) {
        authLinks.style.display = 'none';
        userLinks.style.display = 'flex';

        // Si es VENDEDOR, cambiamos el texto de "Mis Entradas" a "Mi Panel"
        if(Auth.obtenerRol() === 'VENDEDOR') {
            userLinks.children[0].textContent = "Panel de Vendedor";
            userLinks.children[0].href = "crear-evento.html";
        }
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.cerrarSesion();
        });
    }

    // Aquí en el futuro añadiremos el fetchAPI('/eventos') para cargar las tarjetas
});