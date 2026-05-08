document.addEventListener('DOMContentLoaded', () => {
    // Protección de ruta: Solo Vendedores
    if (!Auth.estaAutenticado() || !Auth.obtenerRol().toUpperCase().includes('VENDEDOR')) {
        window.location.href = 'index.html';
        return;
    }

    cargarDashboard();
});

async function cargarDashboard() {
    const contenedorEventos = document.getElementById('eventosGrid');
    const emailVendedor = Auth.obtenerEmail();

    try {
        // Llamamos al backend para traer los eventos de este vendedor
        const eventos = await fetchAPI(`/eventos/vendedor/${emailVendedor}`, 'GET');

        contenedorEventos.innerHTML = '';

        if (!eventos || eventos.length === 0) {
            contenedorEventos.innerHTML = '<p style="color: #888; grid-column: 1/-1; text-align: center;">Aún no has creado ningún evento. ¡Empieza ahora!</p>';
            actualizarEstadisticas(0, 0, 0); // Todo en cero
            return;
        }

        let totalTicketsVendidosGlobal = 0;
        let totalIngresosGlobal = 0;

        eventos.forEach(evento => {
            // --- 1. CÁLCULO DE ESTADÍSTICAS POR EVENTO ---
            let ticketsVendidosEvento = 0;
            let ingresosEvento = 0;
            let htmlZonasStats = '';

            // Si el evento tiene zonas, calculamos el aforo
            if (evento.zonas && evento.zonas.length > 0) {
                htmlZonasStats = '<div class="zonas-stats"><h4 style="color:#fff; font-size:0.9rem; margin-bottom:10px;">Estado del Aforo:</h4>';

                evento.zonas.forEach(zona => {
                    const capacidad = zona.capacidad || 0;
                    // Algunos backends devuelven entradasDisponibles o ticketsVendidos directamente.
                    // Calculamos de forma segura asumiendo que si no hay 'entradasDisponibles', es igual a capacidad (0 ventas).
                    const disponibles = zona.entradasDisponibles !== undefined ? zona.entradasDisponibles : capacidad;
                    const vendidos = zona.entradasVendidas !== undefined ? zona.entradasVendidas : (capacidad - disponibles);
                    const precio = zona.precio || 0;

                    ticketsVendidosEvento += vendidos;
                    ingresosEvento += (vendidos * precio);

                    // Calcular porcentaje para la barra de progreso
                    const porcentaje = capacidad > 0 ? (vendidos / capacidad) * 100 : 0;
                    let colorBarra = '#4ade80'; // Verde por defecto
                    if (porcentaje > 75) colorBarra = '#fbbf24'; // Amarillo si se llena
                    if (porcentaje > 95) colorBarra = '#ff4757'; // Rojo si casi agotado

                    htmlZonasStats += `
                        <div class="zona-stat">
                            <div class="zona-stat-header">
                                <span>${zona.nombre} ($${precio})</span>
                                <span>${vendidos} / ${capacidad}</span>
                            </div>
                            <div class="progress-bar-bg">
                                <div class="progress-fill" style="width: ${porcentaje}%; background-color: ${colorBarra};"></div>
                            </div>
                        </div>
                    `;
                });
                htmlZonasStats += '</div>';
            }

            // Sumamos al total global
            totalTicketsVendidosGlobal += ticketsVendidosEvento;
            totalIngresosGlobal += ingresosEvento;

            // --- 2. RENDERIZADO DE LA TARJETA DEL EVENTO ---
            const id = evento.id;
            const titulo = evento.titulo || 'Sin título';
            const fecha = evento.fecha || 'Fecha por definir';
            const estado = evento.estado || 'BORRADOR';

            let imagenSrc = evento.imagenUrl || evento.imagen;
            if (!imagenSrc || imagenSrc === 'null') {
                imagenSrc = 'https://via.placeholder.com/400x250?text=Villaticket';
            }

            // Etiqueta visual para el estado del evento
            let badgeEstado = '';
            if(estado === 'PUBLICADO') {
                badgeEstado = '<span style="background: #4ade80; color: #14532d; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">PUBLICADO</span>';
            } else {
                badgeEstado = '<span style="background: #fbbf24; color: #78350f; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">BORRADOR</span>';
            }

            contenedorEventos.innerHTML += `
                <article class="card-evento" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <img src="${imagenSrc}" alt="${titulo}" class="card-img" style="height: 180px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/400x250?text=Imagen+No+Disponible'">
                        <div class="card-body">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <span class="card-category">${evento.categoriaNombre || 'General'}</span>
                                ${badgeEstado}
                            </div>
                            <h3 class="card-title">${titulo}</h3>
                            <p class="card-info">📅 ${fecha}</p>

                            ${htmlZonasStats}
                        </div>
                    </div>

                    <div class="card-footer" style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px;">
                        <a href="editar-evento.html?id=${id}" class="btn-secondary" style="flex: 1; text-align: center; text-decoration: none; padding: 8px; border-radius: 5px;">Editar</a>
                        <a href="gestionar-zonas.html?id=${id}" class="btn-primary" style="flex: 1; text-align: center; text-decoration: none; padding: 8px; border-radius: 5px;">Zonas</a>
                    </div>
                </article>
            `;
        });

        // --- 3. ACTUALIZAR TARJETAS SUPERIORES ---
        actualizarEstadisticas(totalTicketsVendidosGlobal, totalIngresosGlobal, eventos.length);

    } catch (error) {
        console.error("Error al cargar dashboard:", error);
        contenedorEventos.innerHTML = '<p style="color: #ff4757; grid-column: 1/-1; text-align: center;">Error de conexión. Asegúrate de tener la sesión iniciada correctamente.</p>';
    }
}

/**
 * Función auxiliar para animar y actualizar los números del Dashboard
 */
function actualizarEstadisticas(tickets, ingresos, eventos) {
    document.getElementById('statTicketsTotal').textContent = tickets.toLocaleString();
    document.getElementById('statIngresosTotal').textContent = `$${ingresos.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('statEventosTotal').textContent = eventos;
}