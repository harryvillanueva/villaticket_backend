// Variable global para almacenar el gráfico y poder actualizarlo sin que se superponga
let graficoIngresos = null;

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.estaAutenticado() || !Auth.obtenerRol().toUpperCase().includes('VENDEDOR')) {
        window.location.href = 'index.html';
        return;
    }
    cargarDashboard();
});

async function cargarDashboard() {
    const contenedorEventos = document.getElementById('eventosGrid');
    const emailVendedor = Auth.obtenerEmail();
    const chartSection = document.getElementById('chartSection');

    try {
        const eventos = await fetchAPI(`/eventos/vendedor/${emailVendedor}`, 'GET');

        contenedorEventos.innerHTML = '';

        if (!eventos || eventos.length === 0) {
            contenedorEventos.innerHTML = '<p style="color: #888; grid-column: 1/-1; text-align: center;">Aún no has creado ningún evento. ¡Empieza ahora!</p>';
            actualizarEstadisticas(0, 0, 0);
            chartSection.style.display = 'none'; // Ocultamos el gráfico si no hay eventos
            return;
        }

        let totalTicketsVendidosGlobal = 0;
        let totalIngresosGlobal = 0;

        // Arrays para alimentar el Gráfico de Chart.js
        const nombresDeEventos = [];
        const ingresosPorEvento = [];

        for (const evento of eventos) {
            let ticketsVendidosEvento = 0;
            let ingresosEvento = 0;
            let htmlZonasStats = '';

            try {
                const zonas = await fetchAPI(`/zonas/evento/${evento.id}`, 'GET');

                if (zonas && zonas.length > 0) {
                    htmlZonasStats = '<div class="zonas-stats"><h4 style="color:#fff; font-size:0.9rem; margin-bottom:10px;">Estado del Aforo:</h4>';

                    for (const zona of zonas) {
                        const capacidad = zona.capacidadTotal || 0;
                        const disponibles = zona.capacidadActual !== undefined ? zona.capacidadActual : capacidad;
                        const precio = zona.precio || 0;

                        const vendidos = capacidad - disponibles;

                        ticketsVendidosEvento += vendidos;
                        ingresosEvento += (vendidos * precio);

                        const porcentaje = capacidad > 0 ? (vendidos / capacidad) * 100 : 0;

                        let colorBarra = '#4ade80';
                        if (porcentaje > 75) colorBarra = '#fbbf24';
                        if (porcentaje > 95) colorBarra = '#ff4757';

                        htmlZonasStats += `
                            <div class="zona-stat">
                                <div class="zona-stat-header">
                                    <span>${zona.nombre} (${precio}€)</span>
                                    <span>${vendidos} / ${capacidad}</span>
                                </div>
                                <div class="progress-bar-bg">
                                    <div class="progress-fill" style="width: ${porcentaje}%; background-color: ${colorBarra};"></div>
                                </div>
                            </div>
                        `;
                    }
                    htmlZonasStats += '</div>';
                }
            } catch (err) {
                console.warn(`No se pudieron cargar las zonas para el evento ${evento.id}`, err);
            }

            totalTicketsVendidosGlobal += ticketsVendidosEvento;
            totalIngresosGlobal += ingresosEvento;

            // Guardamos los datos para el gráfico
            nombresDeEventos.push(evento.titulo || 'Sin título');
            ingresosPorEvento.push(ingresosEvento);

            const id = evento.id;
            const titulo = evento.titulo || 'Sin título';
            const fecha = evento.fecha || 'Fecha por definir';
            const estado = evento.estado || 'BORRADOR';

            let imagenSrc = evento.imagenUrl || evento.imagen;
            if (!imagenSrc || imagenSrc === 'null' || imagenSrc === 'undefined') {
                imagenSrc = 'https://via.placeholder.com/400x250?text=Villaticket';
            }

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
        }

        actualizarEstadisticas(totalTicketsVendidosGlobal, totalIngresosGlobal, eventos.length);

        // Mostramos la sección del gráfico y lo dibujamos
        chartSection.style.display = 'block';
        dibujarGrafico(nombresDeEventos, ingresosPorEvento);

    } catch (error) {
        console.error("Error al cargar dashboard:", error);
        contenedorEventos.innerHTML = '<p style="color: #ff4757; grid-column: 1/-1; text-align: center;">Error al cargar los eventos.</p>';
    }
}

function actualizarEstadisticas(tickets, ingresos, eventos) {
    document.getElementById('statTicketsTotal').textContent = tickets.toLocaleString();
    document.getElementById('statIngresosTotal').textContent = `${ingresos.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}€`;
    document.getElementById('statEventosTotal').textContent = eventos;
}

/**
 * Función que instancia Chart.js y dibuja el gráfico de barras
 */
function dibujarGrafico(etiquetas, datos) {
    const ctx = document.getElementById('ingresosChart').getContext('2d');

    // Si ya existe un gráfico anterior, lo destruimos para evitar parpadeos al recargar
    if (graficoIngresos) {
        graficoIngresos.destroy();
    }

    // Configuramos el nuevo gráfico
    graficoIngresos = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico: Barras
        data: {
            labels: etiquetas, // Los nombres de los eventos
            datasets: [{
                label: 'Ingresos Estimados (€)',
                data: datos, // El dinero recaudado por evento
                backgroundColor: 'rgba(74, 222, 128, 0.7)', // Verde semi-transparente
                borderColor: '#4ade80', // Verde sólido
                borderWidth: 1,
                borderRadius: 4 // Bordes redondeados para un look moderno
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permite que se ajuste a la altura del contenedor
            plugins: {
                legend: {
                    labels: { color: '#ffffff' } // Texto de la leyenda en blanco
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }, // Líneas divisorias tenues
                    ticks: { color: '#a1a1aa' } // Números del eje Y en gris claro
                },
                x: {
                    grid: { display: false }, // Ocultamos las líneas verticales
                    ticks: { color: '#a1a1aa' } // Texto del eje X en gris claro
                }
            }
        }
    });
}