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
    const btnComprar = document.getElementById('btnComprar');
    const totalPagarEl = document.getElementById('totalPagar');

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

    try {
        const zonasDisponibles = await fetchAPI(`/zonas/evento/${eventoId}`, 'GET');

        selectZona.innerHTML = '<option value="" disabled selected>Selecciona una zona</option>';

        let hayZonas = false;

        zonasDisponibles.forEach(zona => {
            if (zona.capacidadActual > 0) {
                hayZonas = true;
                // CORRECCIÓN: Símbolo de Euro
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

    function calcularTotal() {
        const zonaSeleccionada = selectZona.options[selectZona.selectedIndex];
        const cantidad = parseInt(inputCantidad.value) || 0;

        if (zonaSeleccionada && zonaSeleccionada.value !== "" && cantidad > 0) {
            const precio = parseFloat(zonaSeleccionada.getAttribute('data-precio'));
            const total = precio * cantidad;
            // CORRECCIÓN: Símbolo de Euro al final
            totalPagarEl.textContent = `Total: ${total.toFixed(2)} €`;
        } else {
            totalPagarEl.textContent = `Total: 0.00 €`;
        }
    }

    selectZona.addEventListener('change', calcularTotal);
    inputCantidad.addEventListener('input', calcularTotal);

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

        btnComprar.disabled = true;
        btnComprar.textContent = "Procesando pago...";

        try {
            const requestBody = {
                eventoId: parseInt(eventoId),
                zonaId: parseInt(zonaId),
                cantidad: cantidad,
                usuarioEmail: emailCliente
            };

            await fetchAPI('/compras/procesar', 'POST', requestBody);

            alert("¡Compra exitosa! Tus entradas han sido generadas.");
            window.location.href = 'mis-tickets.html';

        } catch (error) {
            alert("Error al comprar: " + error.message);
            btnComprar.disabled = false;
            btnComprar.textContent = "Confirmar Compra";
        }
    });
});