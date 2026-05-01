document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.estaAutenticado() || Auth.obtenerRol() !== 'VENDEDOR') {
        window.location.href = 'index.html';
        return;
    }

    const grid = document.getElementById('misEventosGrid');
    const email = localStorage.getItem('villaticket_email');

    // Botón de cerrar sesión
    const btnLogout = document.getElementById('btnCerrarSesion');
    if(btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.cerrarSesion();
        });
    }

    async function cargarDashboard() {
        try {
            const eventos = await fetchAPI(`/eventos/vendedor/${email}`, 'GET');
            grid.innerHTML = '';

            if (!eventos || eventos.length === 0) {
                grid.innerHTML = '<p style="color: white; grid-column: 1/-1; text-align: center;">No tienes eventos creados.</p>';
                return;
            }

            eventos.forEach(evento => {
                const id = evento.id;
                const estado = evento.estado || 'BORRADOR';

                // Usamos imagenUrl que viene del EventoDTO del backend
                const imagen = (evento.imagenUrl && evento.imagenUrl !== 'null' && evento.imagenUrl !== 'undefined')
                    ? evento.imagenUrl
                    : 'https://via.placeholder.com/400x200?text=Sin+Imagen';

                grid.innerHTML += `
                    <article class="card-evento">
                        <img src="${imagen}" alt="${evento.titulo}" class="card-img" onerror="this.src='https://via.placeholder.com/400x200?text=Error+al+cargar'">
                        <div class="card-body">
                            <span class="card-category">${evento.categoriaNombre}</span>
                            <h3 class="card-title">${evento.titulo}</h3>
                            <p class="card-info">📅 ${evento.fecha}</p>
                            <p class="card-status">Estado: <strong>${estado}</strong></p>

                            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                                <button class="btn-primary" onclick="window.location.href='gestionar-zonas.html?id=${id}'">
                                    🎫 Gestionar Zonas
                                </button>
                                <button class="btn-secondary" style="background: #555; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;"
                                        onclick="window.location.href='editar-evento.html?id=${id}'">
                                    ✏️ Editar Info
                                </button>
                                ${estado === 'BORRADOR' ?
                                    `<button class="btn-success" style="background: #2ecc71; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;"
                                             onclick="publicarEvento(${id})">🚀 Publicar</button>` : ''}
                            </div>
                        </div>
                    </article>
                `;
            });
        } catch (error) {
            console.error("Error en dashboard:", error);
        }
    }

    window.publicarEvento = async (id) => {
        if (!confirm("¿Publicar evento? Ya no podrás volverlo a borrador.")) return;
        try {
            await fetchAPI(`/eventos/${id}/publicar`, 'PUT');
            alert("¡Evento publicado!");
            cargarDashboard();
        } catch (e) {
            alert("Error al publicar: " + e.message);
        }
    };

    await cargarDashboard();
});