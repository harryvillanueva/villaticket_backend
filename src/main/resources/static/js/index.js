document.addEventListener('DOMContentLoaded', async () => {
    const eventosContainer = document.getElementById('eventosContainer');

    // Si no estamos en una página con este contenedor, terminamos
    if (!eventosContainer) return;

    try {
        const baseUrl = window.location.origin + '/api';
        const response = await fetch(`${baseUrl}/eventos/publicados`);

        if (!response.ok) throw new Error("Error al cargar eventos");

        const eventos = await response.json();
        eventosContainer.innerHTML = '';

        if (eventos.length === 0) {
            eventosContainer.innerHTML = '<p style="color: white; text-align: center; width: 100%;">No hay eventos disponibles en este momento.</p>';
            return;
        }

        eventos.forEach(evento => {
            const card = document.createElement('div');
            card.className = 'evento-card';
            card.innerHTML = `
                <img src="${evento.imagenUrl || 'https://via.placeholder.com/300x200'}" alt="${evento.titulo}">
                <div class="evento-info">
                    <span class="categoria-tag">${evento.categoriaNombre}</span>
                    <h3>${evento.titulo}</h3>
                    <p>📅 ${evento.fecha} | ⏰ ${evento.hora}</p>
                    <p>📍 ${evento.ubicacion}</p>
                    <a href="detalle-evento.html?id=${evento.id}" class="btn-ver">Ver Entradas</a>
                </div>
            `;
            eventosContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error:", error);
        eventosContainer.innerHTML = '<p style="color: #ff4757; text-align: center; width: 100%;">Error al conectar con el servidor.</p>';
    }
});