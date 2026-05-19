let graficoIngresos = null;
let saldoActualDisponible = 0;

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.estaAutenticado() || !Auth.obtenerRol().toUpperCase().includes('VENDEDOR')) {
        window.location.href = 'index.html';
        return;
    }
    cargarDashboard();
    cargarMonedero();
});

// --- 1. LÓGICA DEL MONEDERO ---
async function cargarMonedero() {
    try {
        const finanzas = await fetchAPI('/eventos/vendedor/finanzas/saldo', 'GET');
        saldoActualDisponible = finanzas.saldoDisponible;
        document.getElementById('saldoDisponible').textContent = `${finanzas.saldoDisponible.toFixed(2)} €`;
        document.getElementById('saldoRetirado').textContent = `${finanzas.retirado.toFixed(2)} €`;

        const historial = await fetchAPI('/eventos/vendedor/finanzas/historial', 'GET');
        const tabla = document.getElementById('tablaRetirosVendedor');
        tabla.innerHTML = '';

        if (historial.length === 0) {
            tabla.innerHTML = '<tr><td colspan="4" style="text-align:center;">No has realizado retiros aún.</td></tr>';
            return;
        }

        historial.forEach(r => {
            let color = r.estado === 'APROBADO' ? '#4ade80' : (r.estado === 'RECHAZADO' ? '#ff4757' : '#fbbf24');
            let fechaFmt = r.fechaSolicitud ? r.fechaSolicitud.substring(0, 10) : 'N/A';
            tabla.innerHTML += `
                <tr>
                    <td>#${r.id}</td>
                    <td>${fechaFmt}</td>
                    <td style="font-weight:bold;">${r.monto.toFixed(2)} €</td>
                    <td style="color:${color}; font-weight:bold;">${r.estado}</td>
                </tr>
            `;
        });
    } catch (e) {
        console.error("Error al cargar monedero:", e);
    }
}

async function solicitarRetiro() {
    if (saldoActualDisponible <= 0) {
        showToast("No tienes saldo disponible para retirar.", "error");
        return;
    }

    const montoStr = prompt(`Tienes ${saldoActualDisponible.toFixed(2)} € disponibles.\n¿Cuánto deseas retirar a tu cuenta IBAN?`, saldoActualDisponible.toFixed(2));
    if (!montoStr) return;

    const monto = parseFloat(montoStr);
    if (isNaN(monto) || monto <= 0 || monto > saldoActualDisponible) {
        showToast("Monto inválido. Asegúrate de no exceder tu saldo disponible.", "error");
        return;
    }

    try {
        await fetchAPI('/eventos/vendedor/finanzas/solicitar', 'POST', { monto: monto });
        showToast("Solicitud de retiro enviada con éxito. El administrador la revisará pronto.", "success");
        cargarMonedero();
    } catch (error) {
        showToast(error.message || "Error al solicitar el retiro. ¿Tienes configurado tu IBAN en el perfil?", "error");
    }
}

// --- 2. LÓGICA DE EVENTOS Y ESTADÍSTICAS ---
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
                console.warn(`Zonas no cargadas para evento ${evento.id}`);
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
            if (imagenSrc && imagenSrc.startsWith('/')) {
                imagenSrc = window.location.origin + imagenSrc;
            }
            if (!imagenSrc || imagenSrc === 'null' || imagenSrc === 'undefined') {
                imagenSrc = 'css/img/no-image.png';
            }

            let estaCaducado = false;
            if (fecha && fecha !== 'Fecha por definir') {
                const partes = fecha.split('-');
                if (partes.length === 3) {
                    const fechaEventoLocal = new Date(partes[0], partes[1] - 1, partes[2]);
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    if (fechaEventoLocal < hoy) estaCaducado = true;
                }
            }

            let badgeEstado = '';
            let botonAccion = '';

            if (estaCaducado) {
                badgeEstado = '<span style="background: #3f3f46; color: #a1a1aa; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">CADUCADO</span>';
                if (estado === 'PUBLICADO') {
                    botonAccion = `<button onclick="ocultarEvento(${id})" style="flex: 1; padding: 8px; border-radius: 5px; background-color: #fca5a5; color: #7f1d1d; border: none; font-weight: bold; cursor: pointer;">Ocultar</button>`;
                }
            } else if (estado === 'PUBLICADO') {
                badgeEstado = '<span style="background: #4ade80; color: #14532d; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">PUBLICADO</span>';
                botonAccion = `<button onclick="ocultarEvento(${id})" style="flex: 1; padding: 8px; border-radius: 5px; background-color: #fca5a5; color: #7f1d1d; border: none; font-weight: bold; cursor: pointer;">Ocultar</button>`;
            } else if (estado === 'CANCELADO') {
                badgeEstado = '<span style="background: #ff4757; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">CANCELADO POR ADMIN</span>';
            } else {
                badgeEstado = '<span style="background: #fbbf24; color: #78350f; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">BORRADOR</span>';
                botonAccion = `<button onclick="publicarEvento(${id})" style="flex: 1; padding: 8px; border-radius: 5px; background-color: #4ade80; color: #14532d; border: none; font-weight: bold; cursor: pointer;">Publicar</button>`;
            }

            contenedorEventos.innerHTML += `
                <article class="card-evento" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="height: 180px; background: #333; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                            <img src="${imagenSrc}" alt="${titulo}" class="card-img" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
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
                        <a href="editar-evento.html?id=${id}" class="btn-secondary" style="flex: 1; text-align: center; text-decoration: none; padding: 8px; border-radius: 5px;">Editar</a>
                        <a href="gestionar-zonas.html?id=${id}" class="btn-primary" style="flex: 1; text-align: center; text-decoration: none; padding: 8px; border-radius: 5px;">Zonas</a>
                        ${botonAccion}
                    </div>
                </article>
            `;
        }

        actualizarEstadisticas(totalTicketsVendidosGlobal, totalIngresosGlobal, eventos.length);

        if(chartSection && nombresDeEventos.length > 0) {
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
    if (graficoIngresos) graficoIngresos.destroy();

    graficoIngresos = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Ingresos Brutos (€)',
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
    if (!confirm("¿Estás seguro de que deseas publicar este evento?")) return;
    try {
        await fetchAPI(`/eventos/${idEvento}/publicar`, 'PUT');
        showToast("¡Evento publicado con éxito!", "success");
        cargarDashboard();
    } catch (error) { showToast("Hubo un error: " + error.message, "error"); }
}

async function ocultarEvento(idEvento) {
    if (!confirm("¿Deseas ocultar este evento?")) return;
    try {
        await fetchAPI(`/eventos/${idEvento}/ocultar`, 'PUT');
        showToast("El evento ha sido ocultado exitosamente.", "success");
        cargarDashboard();
    } catch (error) { showToast("Hubo un error: " + error.message, "error"); }
}