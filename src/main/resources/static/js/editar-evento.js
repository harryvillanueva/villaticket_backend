document.addEventListener('DOMContentLoaded', async () => {

    if (!Auth.estaAutenticado() || !Auth.obtenerRol().toUpperCase().includes('VENDEDOR')) {
        window.location.href = 'index.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    if (!eventoId) {
        showToast("Error: Evento no válido.", "error");
        setTimeout(() => window.location.href = 'dashboard-vendedor.html', 1500);
        return;
    }

    const selectCategoria = document.getElementById('categoriaId');
    const form = document.getElementById('editarEventoForm');
    const btnSubmit = document.getElementById('btnActualizar');

    if (btnSubmit && !btnSubmit.id) btnSubmit.id = 'btnActualizar';

    try {
        const categorias = await fetchAPI('/eventos/categorias', 'GET');
        if (selectCategoria) {
            selectCategoria.innerHTML = '';
            categorias.forEach(cat => {
                selectCategoria.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
            });
        }

        const evento = await fetchAPI(`/eventos/${eventoId}`, 'GET');

        document.getElementById('titulo').value = evento.titulo || "";
        document.getElementById('descripcion').value = evento.descripcion || "";
        document.getElementById('fecha').value = evento.fecha || "";

        if (evento.hora) {
            document.getElementById('hora').value = evento.hora.substring(0, 5);
        }

        document.getElementById('ubicacion').value = evento.ubicacion || "";

        if (evento.categoriaNombre && selectCategoria) {
            Array.from(selectCategoria.options).forEach(opt => {
                if (opt.text === evento.categoriaNombre) opt.selected = true;
            });
        }

    } catch (error) {
        showToast("No se pudo cargar la información del evento.", "error");
    }

    async function subirImagen(file) {
        const formData = new FormData();
        formData.append('file', file);
        const token = Auth.obtenerToken();
        const baseUrl = typeof API_URL !== 'undefined' ? API_URL : window.location.origin + '/api';

        const response = await fetch(`${baseUrl}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!response.ok) throw new Error(`Fallo al subir la imagen`);
        const data = await response.json();
        return data.url;
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            toggleSpinner('btnActualizar', true);

            try {
                const inputImagen = document.getElementById('imagenPrincipal');
                let nuevaUrlImagen = "";

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
                    imagen: nuevaUrlImagen
                };

                await fetchAPI(`/eventos/${eventoId}`, 'PUT', datosActualizados);

                showToast("¡Evento actualizado correctamente!", "success");
                setTimeout(() => window.location.href = 'dashboard-vendedor.html', 1500);

            } catch (error) {
                showToast(`Error al actualizar: ${error.message}`, "error");
            } finally {
                toggleSpinner('btnActualizar', false);
            }
        });
    }
});