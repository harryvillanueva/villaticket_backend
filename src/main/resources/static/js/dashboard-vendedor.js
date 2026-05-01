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

    try {
        const eventos = await fetchAPI(`/eventos/vendedor/${email}`, 'GET');
        grid.innerHTML = '';

        if (eventos.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-muted);">Aún no has creado ningún evento. ¡Empieza creando uno!</p>';
            return;
        }

        eventos.forEach(evento => {
            grid.innerHTML += `
                <article class="card-evento">
                    <img src="${evento.imagen}" alt="${evento.titulo}" class="card-img" style="height: 150px;">
                    <div class="card-body">
                        <span class="card-category">${evento.nombreCategoria}</span>
                        <h3 class="card-title">${evento.titulo}</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">${evento.fecha} - ${evento.ubicacion}</p>
                        <div style="display: flex; gap: 10px;">
                            <span class="ticket-status status-valid">${evento.estado}</span>
                        </div>
                        <div class="card-footer" style="padding-top: 15px;">
                             <button class="btn-buy-card" style="width: 100%;" onclick="window.location.href='gestionar-zonas.html?id=${evento.id}'">Gestionar Zonas</button>
                        </div>
                    </div>
                </article>
            `;
        });

    } catch (error) {
        grid.innerHTML = '<p style="color: #ff4757;">Error al cargar tus eventos.</p>';
    }
});