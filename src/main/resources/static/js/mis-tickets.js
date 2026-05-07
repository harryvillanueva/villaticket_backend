document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.estaAutenticado()) {
        window.location.href = 'login.html';
        return;
    }

    const gridTickets = document.getElementById('misTicketsGrid');
    const email = localStorage.getItem('villaticket_email');

    async function cargarTickets() {
        try {
            const token = Auth.obtenerToken();
            const baseUrl = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8080/api';

            const response = await fetch(`${baseUrl}/compras/mis-tickets/${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`Error: ${response.status}`);

            const tickets = await response.json();
            gridTickets.innerHTML = '';

            if (!tickets || tickets.length === 0) {
                gridTickets.innerHTML = '<p style="text-align: center; width: 100%; color: #ccc;">Aún no tienes entradas.</p>';
                return;
            }

            tickets.forEach(ticket => {
                const cardWrapper = document.createElement('div');
                cardWrapper.style.display = "flex";
                cardWrapper.style.flexDirection = "column";

                const ticketIdHTML = `ticket-container-${ticket.id}`;

                // IMPORTANTE: Hemos añadido estilos en línea muy específicos para que el PDF no salga en blanco
                cardWrapper.innerHTML = `
                    <article id="${ticketIdHTML}" style="border: 2px solid #444; padding: 25px; border-radius: 12px; background-color: #1e1e1e; color: #ffffff; display: flex; flex-direction: column; align-items: center; gap: 10px; width: 300px; font-family: Arial, sans-serif;">

                        <h2 style="margin: 0; color: #ff4757; text-align: center; text-transform: uppercase; font-size: 1.2rem; width: 100%;">${ticket.eventoTitulo}</h2>

                        <div style="background: #2a2a2a; padding: 12px; width: 100%; border-radius: 8px; margin: 5px 0; border: 1px solid #333; box-sizing: border-box;">
                            <p style="margin: 0; font-size: 0.75rem; color: #ff4757; font-weight: bold; text-transform: uppercase;">Asistente</p>
                            <p style="margin: 2px 0 8px 0; font-weight: bold; font-size: 1rem; color: #ffffff;">${ticket.nombreAsistente}</p>

                            <p style="margin: 0; font-size: 0.75rem; color: #ff4757; font-weight: bold; text-transform: uppercase;">DNI / NIE</p>
                            <p style="margin: 2px 0 0 0; font-weight: bold; font-size: 1rem; color: #ffffff;">${ticket.documentoAsistente}</p>
                        </div>

                        <div style="width: 100%; font-size: 0.9rem; color: #ccc; text-align: center;">
                            <p style="margin: 4px 0;">📅 ${ticket.eventoFecha} | ⏰ ${ticket.eventoHora}</p>
                            <p style="margin: 4px 0;">📍 Ubicación: General</p>
                            <p style="margin: 4px 0; font-weight: bold;">Zona: ${ticket.zonaNombre}</p>
                            <p style="margin: 8px 0; font-size: 1.1rem; color: #2ecc71; font-weight: bold;">Precio: ${ticket.precioPagado} €</p>
                        </div>

                        <div id="qr-${ticket.id}" style="background: #ffffff; padding: 10px; border-radius: 8px; display: inline-block;"></div>

                        <p style="font-size: 0.6rem; color: #666; margin-top: 5px; text-align: center; width: 100%; word-break: break-all;">ID: ${ticket.codigoQr}</p>
                    </article>

                    <button class="btn-pdf" style="margin-top: 10px; margin-bottom: 30px; background: #e67e22; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold;"
                        onclick="descargarPDF('${ticketIdHTML}', '${ticket.nombreAsistente}')">
                        📥 Descargar PDF
                    </button>
                `;

                gridTickets.appendChild(cardWrapper);

                // Generar QR
                new QRCode(document.getElementById(`qr-${ticket.id}`), {
                    text: ticket.codigoQr,
                    width: 130,
                    height: 130,
                    colorDark : "#000000",
                    colorLight : "#ffffff"
                });
            });

        } catch (error) {
            console.error("Error:", error);
            gridTickets.innerHTML = '<p style="color: #ff4757; text-align: center; width: 100%;">Error al cargar tickets.</p>';
        }
    }

    // --- FUNCIÓN MEJORADA PARA GENERAR EL PDF ---
    window.descargarPDF = (elementoId, nombreAsistente) => {
        const elemento = document.getElementById(elementoId);

        // Configuraciones avanzadas para evitar el "PDF en blanco"
        const opciones = {
            margin:       [10, 10],
            filename:     `Ticket_${nombreAsistente.replace(/\s+/g, '_')}.pdf`,
            image:        { type: 'jpeg', quality: 1.0 },
            html2canvas:  {
                scale: 3, // Mayor calidad
                useCORS: true,
                backgroundColor: "#1e1e1e", // Forzamos que el fondo no sea transparente
                letterRendering: true
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Ejecutar con una pequeña promesa para asegurar que el renderizado sea perfecto
        html2pdf().set(opciones).from(elemento).save();
    };

    document.getElementById('btnCerrarSesion')?.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.cerrarSesion();
    });

    cargarTickets();
});