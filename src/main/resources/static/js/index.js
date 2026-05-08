/**
 * index.js
 * Carga la cartelera pública de eventos en la página principal.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const contenedorEventos = document.getElementById('eventosGrid');

    if (!contenedorEventos) return;

    try {
        contenedorEventos.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Cargando cartelera...</p>';

        // CORRECCIÓN: Usamos la ruta de eventos publicados para no tener error 403
        // Si tu backend usa otra ruta pública, cámbiala aquí.
        const eventos = await fetchAPI('/eventos/publicados', 'GET');

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
    } catch (error) {
        console.error("Error al cargar la cartelera:", error);
        contenedorEventos.innerHTML = '<p style="color: #ff4757; text-align: center; grid-column: 1/-1;">Error al conectar con el servidor.</p>';
    }
});