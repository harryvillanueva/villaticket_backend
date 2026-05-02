document.addEventListener('DOMContentLoaded', async () => {
    // Validar que sea un cliente logueado
    if (!Auth.estaAutenticado()) {
        window.location.href = 'login.html';
        return;
    }

    const gridTickets = document.getElementById('misTicketsGrid');
    const email = localStorage.getItem('villaticket_email');

    async function cargarTickets() {
        try {
            // Llamar al endpoint que creamos en CompraController.java
            const tickets = await fetchAPI(`/compras/mis-tickets/${email}`, 'GET');
            gridTickets.innerHTML = '';

            if (!tickets || tickets.length === 0) {
                gridTickets.innerHTML = '<p style="text-align: center; width: 100%;">Aún no has comprado ninguna entrada.</p>';
                return;
            }

            tickets.forEach(ticket => {
                // Crear el contenedor de la tarjeta
                const card = document.createElement('article');
                card.className = 'ticket-card';
                card.style.border = "1px solid #ccc";
                card.style.padding = "15px";
                card.style.borderRadius = "10px";
                card.style.backgroundColor = "#222";
                card.style.color = "white";
                card.style.display = "flex";
                card.style.flexDirection = "column";
                card.style.alignItems = "center";
                card.style.gap = "10px";

                // Agregar la información del ticket
                card.innerHTML = `
                    <h3 style="margin: 0; color: #e74c3c;">${ticket.eventoTitulo}</h3>
                    <p style="margin: 0;">📅 ${ticket.eventoFecha} | ⏰ ${ticket.eventoHora}</p>
                    <p style="margin: 0;"><strong>Zona:</strong> ${ticket.zonaNombre}</p>
                    <p style="margin: 0;"><strong>Precio:</strong> $${ticket.precioPagado}</p>
                    <p style="margin: 0; font-size: 0.9em; color: #2ecc71;">Estado: ${ticket.estado}</p>
                    <div id="qr-${ticket.id}" style="margin-top: 15px; background: white; padding: 10px; border-radius: 5px;"></div>
                    <p style="font-size: 0.7em; color: #888; text-align: center;">ID: ${ticket.codigoQr}</p>
                `;

                gridTickets.appendChild(card);

                // Generar el código QR usando la librería QRCode.js
                // Apuntamos al div que acabamos de crear: "qr-{id}"
                new QRCode(document.getElementById(`qr-${ticket.id}`), {
                    text: ticket.codigoQr, // El texto único UUID
                    width: 128,
                    height: 128,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            });

        } catch (error) {
            console.error("Error al cargar los tickets:", error);
            gridTickets.innerHTML = '<p style="color: red; text-align: center;">Error al cargar tus tickets.</p>';
        }
    }

    // Botón de cerrar sesión
    const btnLogout = document.getElementById('btnCerrarSesion');
    if(btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.cerrarSesion();
        });
    }

    cargarTickets();
});