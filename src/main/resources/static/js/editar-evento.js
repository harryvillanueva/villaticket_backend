document.addEventListener('DOMContentLoaded', async () => {

    if (!Auth.estaAutenticado() || Auth.obtenerRol() !== 'VENDEDOR') {
        window.location.href = 'index.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    if (!eventoId) {
        alert("Error: Evento no válido.");
        window.location.href = 'dashboard-vendedor.html';
        return;
    }

    const selectCategoria = document.getElementById('categoriaId');
    const form = document.getElementById('editarEventoForm');
    const btnSubmit = document.getElementById('btnActualizar');

    // 1. Cargar categorías y datos actuales del evento
    try {
        const categorias = await fetchAPI('/eventos/categorias', 'GET');
        selectCategoria.innerHTML = '';
        categorias.forEach(cat => {
            selectCategoria.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
        });

        const evento = await fetchAPI(`/eventos/${eventoId}`, 'GET');

        document.getElementById('titulo').value = evento.titulo || "";
        document.getElementById('descripcion').value = evento.descripcion || "";
        document.getElementById('fecha').value = evento.fecha || "";

        // Formatear hora de HH:mm:ss a HH:mm para el input tipo time
        if (evento.hora) {
            document.getElementById('hora').value = evento.hora.substring(0, 5);
        }

        document.getElementById('ubicacion').value = evento.ubicacion || "";

        // Pre-seleccionar la categoría correcta
        if (evento.categoriaNombre) {
            Array.from(selectCategoria.options).forEach(opt => {
                if (opt.text === evento.categoriaNombre) {
                    opt.selected = true;
                }
            });
        }

    } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("No se pudo cargar la información del evento.");
    }

    // Función auxiliar para subir imagen
    async function subirImagen(file) {
        const formData = new FormData();
        formData.append('file', file);
        const token = Auth.obtenerToken();
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if (!response.ok) throw new Error(`Fallo al subir la imagen`);
        return await response.text();
    }

    // 3. Enviar actualización
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Actualizando...';

        try {
            const inputImagen = document.getElementById('imagenPrincipal');
            let nuevaUrlImagen = ""; // Inicializar vacío

            if (inputImagen.files.length > 0) {
                nuevaUrlImagen = await subirImagen(inputImagen.files[0]);
            }

            let horaInput = document.getElementById('hora').value;
            if (horaInput.split(':').length === 2) {
                horaInput += ":00";
            }

            const datosActualizados = {
                titulo: document.getElementById('titulo').value,
                descripcion: document.getElementById('descripcion').value,
                fecha: document.getElementById('fecha').value,
                hora: horaInput,
                ubicacion: document.getElementById('ubicacion').value,
                categoriaId: parseInt(selectCategoria.value),
                imagen: nuevaUrlImagen // Se envía al Backend
            };

            // Llamada al endpoint PUT
            await fetchAPI(`/eventos/${eventoId}`, 'PUT', datosActualizados);

            alert("¡Evento actualizado correctamente!");
            window.location.href = 'dashboard-vendedor.html';

        } catch (error) {
            console.error("Error en la actualización:", error);
            alert(`Error al actualizar: ${error.message}`);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Actualizar Evento';
        }
    });
});