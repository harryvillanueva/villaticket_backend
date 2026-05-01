document.addEventListener('DOMContentLoaded', async () => {
    // 1. Manejo del Navbar (Auth)
    const authLinks = document.getElementById('nav-auth-links');
    const userLinks = document.getElementById('nav-user-links');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    if (Auth.estaAutenticado()) {
        authLinks.style.display = 'none';
        userLinks.style.display = 'flex';

        if(Auth.obtenerRol() === 'VENDEDOR') {
            const linkPanel = userLinks.querySelector('a');
            linkPanel.textContent = "Mi Dashboard";
            linkPanel.href = "dashboard-vendedor.html";
        }
    }

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.cerrarSesion();
        });
    }

    // 2. Cargar Eventos desde la API
    const gridEventos = document.getElementById('eventosGrid');

    try {
        const eventos = await fetchAPI('/eventos', 'GET');
        gridEventos.innerHTML = ''; // Limpiamos el grid

        if (eventos.length === 0) {
            gridEventos.innerHTML = '<p style="color: var(--text-muted);">No hay eventos publicados en este momento.</p>';
            return;
        }

        eventos.forEach(evento => {
            // Formatear fecha
            const fecha = new Date(evento.fecha);
            const dia = fecha.getDate();
            const mes = fecha.toLocaleString('es-ES', { month: 'short' }).toUpperCase();

            gridEventos.innerHTML += `
                <article class="card-evento">
                    <div class="card-image-wrapper">
                        <div class="date-badge">
                            <span class="date-day">${dia}</span>
                            <span class="date-month">${mes}</span>
                        </div>
                        <img src="${evento.imagen}" alt="${evento.titulo}" class="card-img">
                    </div>
                    <div class="card-body">
                        <span class="card-category">${evento.nombreCategoria}</span>
                        <h3 class="card-title">${evento.titulo}</h3>
                        <div class="card-info">
                            <span class="material-icons-outlined" style="font-size: 16px;">place</span>
                            <span>${evento.ubicacion}</span>
                        </div>
                        <div class="card-footer">
                            <div class="price-tag">Hora <br><span style="color: white; font-weight: bold;">${evento.hora.substring(0,5)}</span></div>
                            <button class="btn-buy-card" onclick="window.location.href='detalle-evento.html?id=${evento.id}'">Ver detalles</button>
                        </div>
                    </div>
                </article>
            `;
        });
    } catch (error) {
        gridEventos.innerHTML = '<p style="color: #ff4757;">Error al cargar la cartelera.</p>';
    }
});