/**
 * dashboard-vendedor.js
 * Panel principal del vendedor. Lista sus eventos y permite publicarlos o ir a editarlos.
 */

document.addEventListener('DOMContentLoaded', async () => {

    if (!Auth.estaAutenticado() || Auth.obtenerRol() !== 'VENDEDOR') {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('btnCerrarSesion').addEventListener('click', (e) => {
        e.preventDefault();
        Auth.cerrarSesion();
    });

    const grid = document.getElementById('misEventosGrid');
    const email = localStorage.getItem('villaticket_email');

    // Cargar la cartelera del vendedor
    async function cargarDashboard() {
        try {
            const eventos = await fetchAPI(`/eventos/vendedor/${email}`, 'GET');
            grid.innerHTML = '';

            if (!eventos || eventos.length === 0) {
                grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p style="color: #888;">No tienes eventos creados.</p></div>';
                return;
            }

            eventos.forEach(evento => {
                const id = evento.id || 0;
                const titulo = evento.titulo || 'Evento sin título';
                const categoria = evento.categoriaNombre || 'General';
                const fecha = evento.fecha || 'Fecha pendiente';
                const estado = evento.estado || 'BORRADOR';

                let imagenSrc = evento.imagenUrl || evento.imagen || 'https://via.placeholder.com/400x200?text=Sin+Imagen';

                // Mostrar "Publicar" solo si es borrador
                let botonPublicar = '';
                if (estado === 'BORRADOR') {
                    botonPublicar = `<button class="btn-success btn-sm" style="width: 100%; background-color: #2ecc71; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;" onclick="publicarEvento(${id})">✅ Publicar Evento</button>`;
                }

                grid.innerHTML += `
                    <article class="card-evento">
                        <img src="${imagenSrc}" alt="${titulo}" class="card-img" style="height: 180px; width: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/400x200?text=Error'">
                        <div class="card-body">
                            <span class="card-category">${categoria}</span>
                            <h3 class="card-title">${titulo}</h3>
                            <p class="card-info">📅 ${fecha}</p>
                            <div class="card-status-container">
                                <span class="ticket-status ${estado === 'PUBLICADO' ? 'status-valid' : ''}" style="color: ${estado === 'BORRADOR' ? '#f39c12' : '#2ecc71'}; font-weight: bold;">
                                    ${estado}
                                </span>
                            </div>
                            <div class="card-footer" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
                                 <button class="btn-primary" style="width: 100%; padding: 10px; cursor: pointer; border-radius: 5px; border: none;" onclick="window.location.href='gestionar-zonas.html?id=${id}'">
                                    🎫 Gestionar Zonas
                                 </button>
                                 <button style="width: 100%; padding: 10px; cursor: pointer; border-radius: 5px; border: 1px solid #555; background: transparent; color: white;" onclick="window.location.href='editar-evento.html?id=${id}'">
                                    ✏️ Editar Info Evento
                                 </button>
                                 ${botonPublicar}
                            </div>
                        </div>
                    </article>
                `;
            });
        } catch (error) {
            grid.innerHTML = '<p style="color: #ff4757; text-align: center; grid-column: 1/-1;">Error al cargar tus eventos.</p>';
        }
    }

    // Exponer la función de publicar al HTML
    window.publicarEvento = async function(idEvento) {
        if (!confirm('¿Estás seguro de publicar este evento? Una vez publicado, los clientes podrán verlo.')) return;

        try {
            await fetchAPI(`/eventos/${idEvento}/publicar`, 'PUT');
            alert('¡Evento publicado con éxito!');
            await cargarDashboard();
        } catch (error) {
            alert('Error al publicar: ' + error.message);
        }
    };

    await cargarDashboard();
});