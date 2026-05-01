/**
 * index.js
 * Carga la cartelera pública de eventos en la página principal.
 */

document.addEventListener('DOMContentLoaded', async () => {

    const contenedorEventos = document.getElementById('eventosGrid');

    // Gestión básica del navbar dependiendo de si el usuario está logueado
    const navLinks = document.querySelector('.nav-links');
    if (Auth.estaAutenticado()) {
        const rol = Auth.obtenerRol();
        if (rol === 'VENDEDOR') {
            navLinks.innerHTML = `
                <a href="dashboard-vendedor.html" class="nav-item">Mi Panel</a>
                <a href="#" class="nav-item" id="btnCerrarSesion" style="color: #ff4757;">Cerrar sesión</a>
            `;
        } else if (rol === 'CLIENTE') {
            navLinks.innerHTML = `
                <a href="mis-tickets.html" class="nav-item">Mis Entradas</a>
                <a href="#" class="nav-item" id="btnCerrarSesion" style="color: #ff4757;">Cerrar sesión</a>
            `;
        }

        document.getElementById('btnCerrarSesion').addEventListener('click', (e) => {
            e.preventDefault();
            Auth.cerrarSesion();
        });
    }

    // Cargar la cartelera
    try {
        if (contenedorEventos) {
            contenedorEventos.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Cargando cartelera...</p>';

            // Llamamos a la API para obtener solo los eventos PUBLICADOS
            const eventos = await fetchAPI('/eventos', 'GET');
            contenedorEventos.innerHTML = '';

            if (!eventos || eventos.length === 0) {
                contenedorEventos.innerHTML = '<p style="color: #888; text-align: center; grid-column: 1/-1;">No hay eventos disponibles en este momento.</p>';
                return;
            }

            eventos.forEach(evento => {
                const id = evento.id;
                const titulo = evento.titulo || 'Sin título';
                const fecha = evento.fecha || 'Fecha por definir';
                const ubicacion = evento.ubicacion || 'Ubicación por definir';
                const categoria = evento.categoriaNombre || 'General';

                // PREVENCIÓN DEL ERROR /undefined: Validamos que exista una URL real
                let imagenSrc = evento.imagenUrl || evento.imagen;
                if (!imagenSrc || imagenSrc === 'null' || imagenSrc === 'undefined') {
                    imagenSrc = 'https://via.placeholder.com/400x250?text=Villaticket';
                }

                contenedorEventos.innerHTML += `
                    <article class="card-evento">
                        <img src="${imagenSrc}" alt="${titulo}" class="card-img" style="height: 200px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/400x250?text=Error'">
                        <div class="card-body">
                            <span class="card-category">${categoria}</span>
                            <h3 class="card-title">${titulo}</h3>
                            <p class="card-info">📅 ${fecha}</p>
                            <p class="card-info">📍 ${ubicacion}</p>
                            <div class="card-footer" style="margin-top: 15px;">
                                <a href="detalle-evento.html?id=${id}" class="btn-primary" style="display: block; text-align: center; text-decoration: none; padding: 10px; border-radius: 5px;">Ver Detalles</a>
                            </div>
                        </div>
                    </article>
                `;
            });
        }
    } catch (error) {
        console.error("Error al cargar la cartelera:", error);
        if (contenedorEventos) {
            contenedorEventos.innerHTML = '<p style="color: #ff4757; text-align: center; grid-column: 1/-1;">Error al conectar con el servidor.</p>';
        }
    }
});