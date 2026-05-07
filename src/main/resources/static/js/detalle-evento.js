document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    if (!eventoId) {
        alert("Evento no encontrado.");
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
    const asistentesContainer = document.getElementById('asistentesContainer'); // Nuevo contenedor
    const btnComprar = document.getElementById('btnComprar');
    const totalPagarEl = document.getElementById('totalPagar');

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

        loadingDiv.style.display = 'none';
        contenidoDiv.style.display = 'block';

    } catch (error) {
        console.error("Error al cargar el evento:", error);
        loadingDiv.textContent = "Error al cargar el evento. Es posible que no exista.";
        loadingDiv.style.color = "#ff4757";
        return;
    }

    // 2. Cargar las zonas
    try {
        const zonasDisponibles = await fetchAPI(`/zonas/evento/${eventoId}`, 'GET');

        selectZona.innerHTML = '<option value="" disabled selected>Selecciona una zona</option>';

        let hayZonas = false;

        zonasDisponibles.forEach(zona => {
            if (zona.capacidadActual > 0) {
                hayZonas = true;
                selectZona.innerHTML += `<option value="${zona.id}" data-precio="${zona.precio}">
                    ${zona.nombre} - ${zona.precio} € (Quedan: ${zona.capacidadActual})
                </option>`;
            }
        });

        if (!hayZonas) {
            selectZona.innerHTML = '<option value="" disabled>Agotado / Sin zonas creadas</option>';
            btnComprar.disabled = true;
            btnComprar.style.backgroundColor = "#555";
        }
    } catch (error) {
        console.error("Error al cargar las zonas:", error);
        selectZona.innerHTML = '<option value="" disabled>Error al cargar zonas</option>';
    }

    // --- NUEVO: DIBUJAR LOS FORMULARIOS DE ASISTENTES ---
    function renderizarAsistentes() {
        const cantidad = parseInt(inputCantidad.value) || 0;
        asistentesContainer.innerHTML = ''; // Limpiar lo anterior

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

    // 3. Lógica para calcular el total a pagar y redibujar asistentes
    function actualizarCompra() {
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

    // Escuchamos los cambios
    selectZona.addEventListener('change', actualizarCompra);
    inputCantidad.addEventListener('input', () => {
        actualizarCompra();
        renderizarAsistentes(); // Redibujar cajas cuando cambia el número
    });

    // Llamamos una vez al inicio para que dibuje el Asistente 1 (ya que el input dice "1" por defecto)
    renderizarAsistentes();

    // 4. Procesar la compra
    btnComprar.addEventListener('click', async (e) => {
        e.preventDefault();

        if (!Auth.estaAutenticado()) {
            alert("Debes iniciar sesión para poder comprar entradas.");
            window.location.href = 'login.html';
            return;
        }

        const zonaId = selectZona.value;
        const cantidad = parseInt(inputCantidad.value);
        const emailCliente = localStorage.getItem('villaticket_email');

        if (!zonaId || isNaN(cantidad) || cantidad <= 0) {
            alert("Por favor, selecciona una zona y una cantidad válida (mínimo 1).");
            return;
        }

        // --- NUEVO: RECOPILAR DATOS DE LOS ASISTENTES ---
        const listaAsistentes = [];
        for (let i = 1; i <= cantidad; i++) {
            const nombre = document.getElementById(`nombreAsistente${i}`).value.trim();
            const documento = document.getElementById(`docAsistente${i}`).value.trim();

            if (!nombre || !documento) {
                alert(`Por favor completa el Nombre y Documento del Asistente ${i}`);
                return; // Frenamos la compra si falta un dato
            }
            listaAsistentes.push({ nombre: nombre, documento: documento });
        }

        btnComprar.disabled = true;
        btnComprar.textContent = "Procesando pago...";

        try {
            // El request body ahora coincide con la nueva estructura de Java
            const requestBody = {
                eventoId: parseInt(eventoId),
                zonaId: parseInt(zonaId),
                usuarioEmail: emailCliente,
                asistentes: listaAsistentes // Enviamos el array de asistentes en vez de "cantidad"
            };

            const token = Auth.obtenerToken();
            const baseUrl = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8080/api';

            const response = await fetch(`${baseUrl}/compras/procesar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error en el servidor al procesar el pago");
            }

            alert("¡Compra exitosa! Tus entradas han sido generadas.");
            window.location.href = 'mis-tickets.html';

        } catch (error) {
            alert("Error al comprar: " + error.message);
            btnComprar.disabled = false;
            btnComprar.textContent = "Confirmar Compra";
        }
    });
});