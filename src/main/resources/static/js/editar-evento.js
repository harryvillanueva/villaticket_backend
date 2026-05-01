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

    // 1. Cargar categorías
    try {
        const categorias = await fetchAPI('/eventos/categorias', 'GET');
        selectCategoria.innerHTML = '';
        categorias.forEach(cat => {
            selectCategoria.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
        });
    } catch (error) {
        console.error("Error cargando categorías");
    }

    // 2. Cargar datos actuales del evento
    try {
        const evento = await fetchAPI(`/eventos/${eventoId}`, 'GET');

        document.getElementById('titulo').value = evento.titulo;
        document.getElementById('descripcion').value = evento.descripcion;
        document.getElementById('fecha').value = evento.fecha;

        // La hora a veces viene con segundos "18:00:00", el input type="time" necesita "18:00"
        let horaFormat = evento.hora;
        if(horaFormat && horaFormat.split(':').length === 3){
            horaFormat = horaFormat.substring(0,5);
        }
        document.getElementById('hora').value = horaFormat;

        document.getElementById('ubicacion').value = evento.ubicacion;

        // Seleccionar la categoría correcta iterando las opciones
        Array.from(selectCategoria.options).forEach(opt => {
            if (opt.text === evento.categoriaNombre) {
                opt.selected = true;
            }
        });

    } catch (error) {
        alert("No se pudo cargar el evento.");
        window.location.href = 'dashboard-vendedor.html';
    }

    // Función para subir imagen
    async function subirImagen(file) {
        const formData = new FormData();
        formData.append('file', file);
        const token = Auth.obtenerToken();
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        if (!response.ok) throw new Error(`Fallo al subir imagen`);
        return await response.text();
    }

    // 3. Enviar actualización
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Actualizando...';

        try {
            const inputImagen = document.getElementById('imagenPrincipal');
            let nuevaUrlImagen = null;

            if (inputImagen.files.length > 0) {
                nuevaUrlImagen = await subirImagen(inputImagen.files[0]);
            }

            let horaFormateada = document.getElementById('hora').value;
            if (horaFormateada.split(':').length === 2) { horaFormateada += ":00"; }

            const datosActualizados = {
                titulo: document.getElementById('titulo').value,
                descripcion: document.getElementById('descripcion').value,
                fecha: document.getElementById('fecha').value,
                hora: horaFormateada,
                ubicacion: document.getElementById('ubicacion').value,
                categoriaId: document.getElementById('categoriaId').value,
                imagen: nuevaUrlImagen
            };

            await fetchAPI(`/eventos/${eventoId}`, 'PUT', datosActualizados);
            alert("¡Evento actualizado correctamente!");
            window.location.href = 'dashboard-vendedor.html';

        } catch (error) {
            alert(`Error al actualizar: ${error.message}`);
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Actualizar Evento';
        }
    });
});