/**
 * index.js - Cartelera con Buscador y Filtros por Chips
 */

let todosLosEventos = [];
let categoriaSeleccionada = 'todas';
let textoBusqueda = '';

document.addEventListener('DOMContentLoaded', async () => {
    const contenedorEventos = document.getElementById('eventosGrid');
    const searchInput = document.getElementById('searchInput');
    const chipsCategorias = document.querySelectorAll('.chip');

    if (!contenedorEventos) return;

    // 1. CARGA INICIAL (Conectado a la paginación del Backend)
    try {
        contenedorEventos.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">Cargando cartelera...</p>';

        // Obtenemos los primeros 50 eventos
        const responseData = await fetchAPI('/eventos/publicados?page=0&size=50', 'GET');

        // Compatibilidad: Si Spring envía un "Page", los datos están en .content
        todosLosEventos = responseData.content ? responseData.content : responseData;

        filtrarYMostrar();
    } catch (error) {
        console.error("Error al cargar la cartelera:", error);
        contenedorEventos.innerHTML = '<p style="color: #ff4757; text-align: center; grid-column: 1/-1;">Error al conectar con el servidor.</p>';
    }

    // 2. LÓGICA DEL BUSCADOR
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            textoBusqueda = e.target.value.toLowerCase();
            filtrarYMostrar();
        });
    }

    // 3. LÓGICA DE CATEGORÍAS (CHIPS)
    chipsCategorias.forEach(chip => {
        chip.addEventListener('click', () => {
            // Estética: Cambiar el chip activo
            chipsCategorias.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            // Funcionalidad: Obtener la categoría y filtrar
            categoriaSeleccionada = chip.getAttribute('data-categoria');
            filtrarYMostrar();
        });
    });
});

function filtrarYMostrar() {
    const contenedorEventos = document.getElementById('eventosGrid');

    const eventosFiltrados = todosLosEventos.filter(evento => {
        // Filtro por categoría (comparamos con el data-categoria del chip)
        const coincideCategoria = (categoriaSeleccionada === 'todas' || evento.categoriaNombre === categoriaSeleccionada);

        // Filtro por texto
        const titulo = (evento.titulo || '').toLowerCase();
        const descripcion = (evento.descripcion || '').toLowerCase();
        const coincideBusqueda = titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda);

        return coincideCategoria && coincideBusqueda;
    });

    contenedorEventos.innerHTML = '';

    if (eventosFiltrados.length === 0) {
        contenedorEventos.innerHTML = '<p style="color: #888; text-align: center; grid-column: 1/-1; margin-top: 50px;">No hay eventos que coincidan con tu búsqueda.</p>';
        return;
    }

    eventosFiltrados.forEach(evento => {
        const id = evento.id;
        const titulo = evento.titulo || 'Sin título';
        const fecha = evento.fecha || 'Fecha por definir';
        const ubicacion = evento.ubicacion || 'Ubicación por definir';
        const categoria = evento.categoriaNombre || 'General';

        // --- CORRECCIÓN DE RUTAS DE IMAGEN PARA EVITAR ERRORES DE PLACEHOLDER ---
        let imagenSrc = evento.imagenUrl || evento.imagen;
        if (imagenSrc && imagenSrc.startsWith('/')) {
            imagenSrc = window.location.origin + imagenSrc;
        }
        if (!imagenSrc || imagenSrc === 'null' || imagenSrc === 'undefined') {
            imagenSrc = 'css/img/no-image.png'; // Usamos una imagen local u omitimos
        }

        // Evaluar caducidad
        let estaCaducado = false;
        if (fecha && fecha !== 'Fecha por definir') {
            const partes = fecha.split('-');
            const fechaEvento = new Date(partes[0], partes[1] - 1, partes[2]);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            if (fechaEvento < hoy) estaCaducado = true;
        }

        let badgeEstado = estaCaducado ? '<span style="background: #3f3f46; color: #a1a1aa; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; margin-left: 10px;">CADUCADO</span>' : '';
        let botonTexto = estaCaducado ? 'Ver Detalles (Finalizado)' : 'Ver Detalles';
        let botonClase = estaCaducado ? 'btn-secondary' : 'btn-primary';

        // Construir la tarjeta del evento
        contenedorEventos.innerHTML += `
            <article class="card-evento" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="height: 200px; background: #333; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                        <img src="${imagenSrc}" alt="${titulo}" class="card-img" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="card-body">
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <span class="card-category">${categoria}</span>
                            ${badgeEstado}
                        </div>
                        <h3 class="card-title">${titulo}</h3>
                        <p class="card-info">📅 ${fecha}</p>
                        <p class="card-info">📍 ${ubicacion}</p>
                    </div>
                </div>
                <div class="card-footer" style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.05); margin-top: auto;">
                    <a href="detalle-evento.html?id=${id}" class="${botonClase}" style="display: block; text-align: center; text-decoration: none; padding: 10px; border-radius: 5px;">${botonTexto}</a>
                </div>
            </article>
        `;
    });
}