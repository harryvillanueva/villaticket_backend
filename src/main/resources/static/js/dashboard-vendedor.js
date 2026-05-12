// Variable global para almacenar el gráfico
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
            if(chartSection) chartSection.style.display = 'none';
            return;
        }

        let totalTicketsVendidosGlobal = 0;
        let totalIngresosGlobal = 0;
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

            // --- LÓGICA DE CADUCIDAD AUTOMÁTICA ---
            let estaCaducado = false;
            if (fecha && fecha !== 'Fecha por definir') {
                const partes = fecha.split('-');
                if (partes.length === 3) {
                    const fechaEventoLocal = new Date(partes[0], partes[1] - 1, partes[2]);
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    if (fechaEventoLocal < hoy) {
                        estaCaducado = true;
                    }
                }
            }

            let badgeEstado = '';
            let botonAccion = '';

            // --- RENDERIZADO INTELIGENTE DE BOTONES (ACTUALIZADO) ---
            if (estaCaducado) {
                badgeEstado = '<span style="background: #3f3f46; color: #a1a1aa; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">CADUCADO</span>';
                // Solo si el evento caducado seguía público, le permitimos ocultarlo para limpiar la cartelera
                if (estado === 'PUBLICADO') {
                    botonAccion = `<button onclick="ocultarEvento(${id})" style="flex: 1; text-align: center; padding: 8px; border-radius: 5px; background-color: #fca5a5; color: #7f1d1d; border: none; font-weight: bold; cursor: pointer; min-width: 80px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Ocultar</button>`;
                }
            } else if (estado === 'PUBLICADO') {
                badgeEstado = '<span style="background: #4ade80; color: #14532d; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">PUBLICADO</span>';
                botonAccion = `<button onclick="ocultarEvento(${id})" style="flex: 1; text-align: center; padding: 8px; border-radius: 5px; background-color: #fca5a5; color: #7f1d1d; border: none; font-weight: bold; cursor: pointer; min-width: 80px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Ocultar</button>`;
            } else {
                badgeEstado = '<span style="background: #fbbf24; color: #78350f; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">BORRADOR</span>';
                botonAccion = `<button onclick="publicarEvento(${id})" style="flex: 1; text-align: center; padding: 8px; border-radius: 5px; background-color: #4ade80; color: #14532d; border: none; font-weight: bold; cursor: pointer; min-width: 80px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Publicar</button>`;
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

                    <div class="card-footer" style="padding: 15px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px; flex-wrap: wrap;">
                        <a href="editar-evento.html?id=${id}" class="btn-secondary" style="flex: 1; text-align: center; text-decoration: none; padding: 8px; border-radius: 5px; min-width: 80px;">Editar</a>
                        <a href="gestionar-zonas.html?id=${id}" class="btn-primary" style="flex: 1; text-align: center; text-decoration: none; padding: 8px; border-radius: 5px; min-width: 80px;">Zonas</a>
                        ${botonAccion}
                    </div>
                </article>
            `;
        }

        actualizarEstadisticas(totalTicketsVendidosGlobal, totalIngresosGlobal, eventos.length);

        if(chartSection) {
            chartSection.style.display = 'block';
            dibujarGrafico(nombresDeEventos, ingresosPorEvento);
        }

    } catch (error) {
        console.error("Error al cargar dashboard:", error);
        contenedorEventos.innerHTML = '<p style="color: #ff4757; grid-column: 1/-1; text-align: center;">Error al cargar los eventos.</p>';
    }
}

function actualizarEstadisticas(tickets, ingresos, eventos) {
    document.getElementById('statTicketsTotal').textContent = tickets.toLocaleString();
    document.getElementById('statIngresosTotal').textContent = `${ingresos.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} €`;
    document.getElementById('statEventosTotal').textContent = eventos;
}

function dibujarGrafico(etiquetas, datos) {
    const canvas = document.getElementById('ingresosChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (graficoIngresos) {
        graficoIngresos.destroy();
    }

    graficoIngresos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Ingresos Estimados (€)',
                data: datos,
                backgroundColor: 'rgba(74, 222, 128, 0.7)',
                borderColor: '#4ade80',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#ffffff' } } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#a1a1aa' } },
                x: { grid: { display: false }, ticks: { color: '#a1a1aa' } }
            }
        }
    });
}

async function publicarEvento(idEvento) {
    if (!confirm("¿Estás seguro de que deseas publicar este evento? Será visible para todos los clientes.")) {
        return;
    }
    try {
        await fetchAPI(`/eventos/${idEvento}/publicar`, 'PUT');
        alert("¡Evento publicado con éxito!");
        cargarDashboard();
    } catch (error) {
        console.error("Error al publicar evento:", error);
        alert("Hubo un error al intentar publicar el evento: " + error.message);
    }
}

async function ocultarEvento(idEvento) {
    if (!confirm("¿Deseas ocultar este evento? Pasará a ser un Borrador y los clientes no podrán verlo ni comprar tickets.")) {
        return;
    }
    try {
        await fetchAPI(`/eventos/${idEvento}/ocultar`, 'PUT');
        alert("El evento ha sido ocultado exitosamente.");
        cargarDashboard();
    } catch (error) {
        console.error("Error al ocultar evento:", error);
        alert("Hubo un error al intentar ocultar el evento: " + error.message);
    }
}