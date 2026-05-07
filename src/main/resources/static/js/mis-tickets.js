document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificación de seguridad inicial
    if (!Auth.estaAutenticado()) {
        window.location.href = 'login.html';
        return;
    }

    const gridTickets = document.getElementById('misTicketsGrid');
    const email = localStorage.getItem('villaticket_email');

    /**
     * Carga los tickets del usuario desde el servidor y los muestra en pantalla
     */
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

            if (!response.ok) throw new Error(`Error en el servidor: ${response.status}`);

            const tickets = await response.json();
            gridTickets.innerHTML = ''; // Limpiar cargador

            if (!tickets || tickets.length === 0) {
                gridTickets.innerHTML = `
                    <div style="text-align: center; width: 100%; padding: 50px; color: #888;">
                        <p style="font-size: 1.2rem;">Aún no tienes entradas compradas.</p>
                        <a href="index.html" class="btn-primary" style="display: inline-block; margin-top: 15px; text-decoration: none;">Ir a cartelera</a>
                    </div>`;
                return;
            }

            // Dibujar cada ticket en la cuadrícula
            tickets.forEach(ticket => {
                const cardWrapper = document.createElement('div');
                cardWrapper.style.display = "flex";
                cardWrapper.style.flexDirection = "column";
                cardWrapper.style.alignItems = "center";

                cardWrapper.innerHTML = `
                    <article class="ticket-card" style="border: 1px solid #444; padding: 20px; border-radius: 12px; background-color: #1e1e1e; color: #ffffff; width: 300px; text-align: center; font-family: 'Inter', sans-serif;">

                        <h2 style="margin: 0 0 10px 0; color: #ff4757; text-transform: uppercase; font-size: 1.2rem;">${ticket.eventoTitulo}</h2>

                        <div style="background: #2a2a2a; padding: 12px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #333;">
                            <p style="margin: 0; font-size: 0.7rem; color: #ff4757; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Asistente</p>
                            <p style="margin: 2px 0 8px 0; font-weight: bold; font-size: 1rem;">${ticket.nombreAsistente}</p>

                            <p style="margin: 0; font-size: 0.7rem; color: #ff4757; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">DNI / NIE</p>
                            <p style="margin: 2px 0 0 0; font-weight: bold; font-size: 1rem;">${ticket.documentoAsistente}</p>
                        </div>

                        <div style="font-size: 0.85rem; color: #ccc; margin-bottom: 15px; line-height: 1.4;">
                            <p style="margin: 3px 0;">📅 ${ticket.eventoFecha} | ⏰ ${ticket.eventoHora}</p>
                            <p style="margin: 3px 0;"><strong>Zona:</strong> ${ticket.zonaNombre}</p>
                            <p style="margin: 10px 0; font-size: 1.1rem; color: #2ecc71; font-weight: bold;">${ticket.precioPagado} €</p>
                        </div>

                        <div id="qr-${ticket.id}" style="background: white; padding: 10px; border-radius: 5px; display: inline-block;"></div>

                        <p style="font-size: 0.6rem; color: #666; margin-top: 10px; word-break: break-all;">ID: ${ticket.codigoQr}</p>
                    </article>

                    <button class="btn-pdf"
                        style="margin-top: 12px; margin-bottom: 35px; background: #e67e22; color: white; border: none; padding: 12px 25px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 300px; display: flex; align-items: center; justify-content: center; gap: 8px;"
                        onclick="descargarPDF(${ticket.id}, '${ticket.nombreAsistente}')">
                        <span>📥</span> Descargar Ticket PDF
                    </button>
                `;

                gridTickets.appendChild(cardWrapper);

                // Generar QR en el navegador (solo para visualización rápida)
                new QRCode(document.getElementById(`qr-${ticket.id}`), {
                    text: ticket.codigoQr,
                    width: 120,
                    height: 120,
                    colorDark : "#000000",
                    colorLight : "#ffffff"
                });
            });

        } catch (error) {
            console.error("Error al cargar tickets:", error);
            gridTickets.innerHTML = `<p style="color: #ff4757; text-align: center; width: 100%;">Error: ${error.message}</p>`;
        }
    }

    /**
     * Solicita al Backend la generación del PDF real y lo descarga
     */
    window.descargarPDF = async (ticketId, nombreAsistente) => {
        try {
            // Cambiar texto del botón momentáneamente
            const btn = event.currentTarget;
            const textoOriginal = btn.innerHTML;
            btn.innerHTML = "<span>⏳</span> Generando...";
            btn.disabled = true;

            const token = Auth.obtenerToken();
            const baseUrl = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8080/api';

            // Petición al endpoint de Java
            const response = await fetch(`${baseUrl}/compras/ticket/${ticketId}/pdf`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("No se pudo generar el PDF en el servidor");

            // Recibimos el archivo como un BLOB (Binary Large Object)
            const blob = await response.blob();

            // Creamos un link invisible para forzar la descarga
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Ticket_Villaticket_${nombreAsistente.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Limpieza
            a.remove();
            window.URL.revokeObjectURL(url);

            // Restaurar botón
            btn.innerHTML = textoOriginal;
            btn.disabled = false;

        } catch (error) {
            alert("Error al descargar el ticket: " + error.message);
            console.error(error);
        }
    };

    // Configuración del botón de cierre de sesión
    document.getElementById('btnCerrarSesion')?.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.cerrarSesion();
    });

    // Iniciar carga
    cargarTickets();
});