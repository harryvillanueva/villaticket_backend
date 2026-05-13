document.addEventListener('DOMContentLoaded', async () => {

    if (!Auth.estaAutenticado() || !Auth.obtenerRol().toUpperCase().includes('VENDEDOR')) {
        showToast("Acceso denegado. Solo los vendedores pueden crear eventos.", "error");
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    const selectCategoria = document.getElementById('categoriaId');
    const form = document.getElementById('crearEventoForm');
    const errorDiv = document.getElementById('eventoError');
    const btnSubmit = document.getElementById('btnCrear');

    // Aseguramos el ID para el spinner si no existe
    if (btnSubmit && !btnSubmit.id) btnSubmit.id = 'btnCrear';

    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.cerrarSesion();
        });
    }

    try {
        const categorias = await fetchAPI('/eventos/categorias', 'GET');
        if (selectCategoria) {
            selectCategoria.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
            categorias.forEach(cat => {
                selectCategoria.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
            });
        }
    } catch (error) {
        if (selectCategoria) selectCategoria.innerHTML = '<option value="" disabled>Error al cargar categorías</option>';
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

        if (!response.ok) throw new Error(`Fallo al subir la imagen: ${file.name}`);
        const data = await response.json();
        return data.url;
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (errorDiv) errorDiv.style.display = 'none';

            toggleSpinner('btnCrear', true);
            const emailVendedor = Auth.obtenerEmail();

            try {
                const inputImagenPrincipal = document.getElementById('imagenPrincipal');
                const inputGaleria = document.getElementById('galeriaImagenes');

                let urlPrincipal = '';
                let urlsGaleria = [];

                if (inputImagenPrincipal.files.length > 0) {
                    urlPrincipal = await subirImagen(inputImagenPrincipal.files[0]);
                } else {
                    throw new Error("Debes subir una imagen principal para el evento.");
                }

                if (inputGaleria && inputGaleria.files.length > 0) {
                    for (let i = 0; i < inputGaleria.files.length; i++) {
                        const url = await subirImagen(inputGaleria.files[i]);
                        urlsGaleria.push(url);
                    }
                }

                let horaFormateada = document.getElementById('hora').value;
                if (horaFormateada.split(':').length === 2) {
                    horaFormateada += ":00";
                }

                const data = {
                    titulo: document.getElementById('titulo').value,
                    descripcion: document.getElementById('descripcion').value,
                    fecha: document.getElementById('fecha').value,
                    hora: horaFormateada,
                    ubicacion: document.getElementById('ubicacion').value,
                    categoriaId: document.getElementById('categoriaId').value,
                    imagen: urlPrincipal,
                    galeria: urlsGaleria,
                    vendedorEmail: emailVendedor
                };

                await fetchAPI('/eventos/crear', 'POST', data);

                showToast("¡Evento y galería guardados con éxito!", "success");
                setTimeout(() => window.location.href = 'dashboard-vendedor.html', 1500);

            } catch (error) {
                if (errorDiv) {
                    errorDiv.textContent = error.message;
                    errorDiv.style.display = 'block';
                }
                showToast(error.message, "error");
            } finally {
                toggleSpinner('btnCrear', false);
            }
        });
    }
});