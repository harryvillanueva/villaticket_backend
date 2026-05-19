document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    if (!eventoId) {
        showToast("Evento no encontrado.", "error");
        window.location.href = 'index.html';
        return;
    }

    const loadingDiv = document.getElementById('mensajeEstado');
    const contenidoDiv = document.getElementById('detalleContenedor');

    const tituloEl = document.getElementById('eventoTitulo');
    const categoriaEl = document.getElementById('eventoCategoria');
    const imagenEl = document.getElementById('eventoImagen');
    const descEl = document.getElementById('eventoDescripcion');
    const fechaEl = document.getElementById('eventoFecha');
    const horaEl = document.getElementById('eventoHora');
    const ubicacionEl = document.getElementById('eventoUbicacion');

    const selectZona = document.getElementById('zonaSelect');
    const inputCantidad = document.getElementById('cantidadInput');
    const asistentesContainer = document.getElementById('asistentesContainer');
    const btnComprar = document.getElementById('btnComprar');
    const totalPagarEl = document.getElementById('totalPagar');

    let estaCaducado = false;

    // 1. Cargar la información del evento
    try {
        const evento = await fetchAPI(`/eventos/${eventoId}`, 'GET');

        tituloEl.textContent = evento.titulo || "Sin título";
        categoriaEl.textContent = evento.categoriaNombre || "General";
        descEl.textContent = evento.descripcion || "Sin descripción disponible.";
        fechaEl.textContent = evento.fecha || "--/--/----";
        horaEl.textContent = evento.hora || "--:--";
        ubicacionEl.textContent = evento.ubicacion || "Ubicación no especificada";

        if(evento.imagenUrl && evento.imagenUrl !== 'null') {
            imagenEl.src = evento.imagenUrl;
        }

        // --- VERIFICACIÓN DE CADUCIDAD ---
        if (evento.fecha && evento.fecha !== 'Fecha por definir') {
            const partes = evento.fecha.split('-');
            if (partes.length === 3) {
                const fechaEvento = new Date(partes[0], partes[1] - 1, partes[2]);
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                if (fechaEvento < hoy) {
                    estaCaducado = true;
                }
            }
        }

        // Mostramos el contenedor de detalles
        if(loadingDiv) loadingDiv.style.display = 'none';
        if(contenidoDiv) contenidoDiv.style.display = 'block';

    } catch (error) {
        console.error("Error al cargar el evento:", error);
        if(loadingDiv) {
            loadingDiv.textContent = "Error al cargar el evento. Es posible que no exista.";
            loadingDiv.style.color = "#ff4757";
        }
        return;
    }

    // --- LÓGICA DE BLOQUEO DE COMPRA SI HA CADUCADO ---
    if (estaCaducado) {
        const bookingBody = document.querySelector('.booking-body');
        if (bookingBody) {
            bookingBody.innerHTML = `
                <div style="background: rgba(255, 71, 87, 0.1); color: #ff4757; padding: 20px; border: 1px solid #ff4757; border-radius: 8px; text-align: center;">
                    <span class="material-icons-outlined" style="font-size: 40px; margin-bottom: 10px;">event_busy</span>
                    <br>
                    <strong>¡Evento Finalizado!</strong>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Este evento ya se ha realizado y la venta de entradas está cerrada permanentemente.</p>
                </div>
            `;
        }
        return;
    }

    // 2. Cargar las zonas (Solo si el evento NO ha caducado)
    try {
        const zonasDisponibles = await fetchAPI(`/zonas/evento/${eventoId}`, 'GET');
        if(selectZona) selectZona.innerHTML = '<option value="" disabled selected>Selecciona una zona</option>';

        let hayZonas = false;
        zonasDisponibles.forEach(zona => {
            if (zona.capacidadActual > 0) {
                hayZonas = true;
                if(selectZona) selectZona.innerHTML += `<option value="${zona.id}" data-precio="${zona.precio}">
                    ${zona.nombre} - ${zona.precio} € (Quedan: ${zona.capacidadActual})
                </option>`;
            }
        });

        if (!hayZonas && selectZona) {
            selectZona.innerHTML = '<option value="" disabled>Agotado / Sin zonas creadas</option>';
            if(btnComprar) {
                btnComprar.disabled = true;
                btnComprar.style.backgroundColor = "#555";
            }
        }
    } catch (error) {
        console.error("Error al cargar las zonas:", error);
        if(selectZona) selectZona.innerHTML = '<option value="" disabled>Error al cargar zonas</option>';
    }

    function renderizarAsistentes() {
        if(!inputCantidad || !asistentesContainer) return;
        const cantidad = parseInt(inputCantidad.value) || 0;
        asistentesContainer.innerHTML = '';

        if (cantidad > 0) {
            for (let i = 1; i <= cantidad; i++) {
                asistentesContainer.innerHTML += `
                    <div style="margin-top: 15px; padding: 15px; background: #333; border-radius: 8px; border: 1px solid #555;">
                        <h4 style="color: white; margin-top: 0; margin-bottom: 10px;">Asistente ${i}</h4>
                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="nombreAsistente${i}" placeholder="Nombre Completo" required style="flex: 1; padding: 10px; border-radius: 5px; border: 1px solid #666; background: #222; color: white;">
                            <input type="text" id="docAsistente${i}" placeholder="DNI / NIE" required style="flex: 1; padding: 10px; border-radius: 5px; border: 1px solid #666; background: #222; color: white;">
                        </div>
                    </div>
                `;
            }
        }
    }

    function actualizarCompra() {
        if(!selectZona || !totalPagarEl) return;
        const zonaSeleccionada = selectZona.options[selectZona.selectedIndex];
        const cantidad = parseInt(inputCantidad.value) || 0;

        if (zonaSeleccionada && zonaSeleccionada.value !== "" && cantidad > 0) {
            const precio = parseFloat(zonaSeleccionada.getAttribute('data-precio'));
            const total = precio * cantidad;
            totalPagarEl.textContent = `Total: ${total.toFixed(2)} €`;
        } else {
            totalPagarEl.textContent = `Total: 0.00 €`;
        }
    }

    if(selectZona) selectZona.addEventListener('change', actualizarCompra);
    if(inputCantidad) {
        inputCantidad.addEventListener('input', () => {
            actualizarCompra();
            renderizarAsistentes();
        });
    }

    renderizarAsistentes();

    // 4. Procesar la compra
    if(btnComprar) {
        btnComprar.addEventListener('click', async (e) => {
            e.preventDefault();

            if (!Auth.estaAutenticado()) {
                showToast("Debes iniciar sesión para poder comprar entradas.", "error");
                setTimeout(() => window.location.href = 'login.html', 1500);
                return;
            }

            const zonaId = selectZona.value;
            const cantidad = parseInt(inputCantidad.value);
            const emailCliente = Auth.obtenerEmail();

            if (!zonaId || isNaN(cantidad) || cantidad <= 0) {
                showToast("Por favor, selecciona una zona y una cantidad válida (mínimo 1).", "error");
                return;
            }

            const listaAsistentes = [];
            for (let i = 1; i <= cantidad; i++) {
                const nombre = document.getElementById(`nombreAsistente${i}`).value.trim();
                const documento = document.getElementById(`docAsistente${i}`).value.trim();

                if (!nombre || !documento) {
                    showToast(`Por favor completa el Nombre y Documento del Asistente ${i}`, "error");
                    return;
                }
                listaAsistentes.push({ nombre: nombre, documento: documento });
            }

            toggleSpinner('btnComprar', true);

            try {
                const requestBody = {
                    eventoId: parseInt(eventoId),
                    zonaId: parseInt(zonaId),
                    usuarioEmail: emailCliente,
                    asistentes: listaAsistentes
                };

                const response = await fetchAPI('/compras/procesar', 'POST', requestBody);
                showToast("¡Compra exitosa! Tus entradas han sido generadas.", "success");
                setTimeout(() => window.location.href = 'mis-tickets.html', 2000);

            } catch (error) {
                showToast("Error al comprar: " + error.message, "error");
                toggleSpinner('btnComprar', false);
            }
        });
    }
});