document.addEventListener('DOMContentLoaded', async () => {

    // 1. Protección de ruta: Solo vendedores pueden entrar aquí
    if (!Auth.estaAutenticado() || Auth.obtenerRol() !== 'VENDEDOR') {
        alert("Acceso denegado. Solo los vendedores pueden crear eventos.");
        window.location.href = 'index.html';
        return;
    }

    const selectCategoria = document.getElementById('categoriaId');
    const form = document.getElementById('crearEventoForm');
    const errorDiv = document.getElementById('eventoError');
    const btnSubmit = document.getElementById('btnCrear');

    // Botón de cerrar sesión
    document.getElementById('btnCerrarSesion').addEventListener('click', (e) => {
        e.preventDefault();
        Auth.cerrarSesion();
    });

    // 2. Cargar categorías desde el backend
    try {
        const categorias = await fetchAPI('/eventos/categorias', 'GET');
        selectCategoria.innerHTML = '<option value="" disabled selected>Selecciona una categoría</option>';
        categorias.forEach(cat => {
            selectCategoria.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
        });
    } catch (error) {
        selectCategoria.innerHTML = '<option value="" disabled>Error al cargar categorías</option>';
    }

    // --- FUNCIÓN AUXILIAR: Subir archivo físico a Spring Boot ---
    async function subirImagen(file) {
        const formData = new FormData();
        formData.append('file', file); // El nombre 'file' debe coincidir con tu @RequestParam en Java

        const token = Auth.obtenerToken();

        // Hacemos la petición a tu controlador de subida (asegúrate de que la ruta sea la correcta)
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                // Importante: Al usar FormData NO se pone 'Content-Type', el navegador lo auto-configura con el 'boundary' adecuado.
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Fallo al subir la imagen: ${file.name}`);
        }

        // Retorna la URL estática (ej: "/uploads/imagen.png")
        return await response.text();
    }

    // 3. Manejar el envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Procesando imágenes, por favor espera...';

        const emailVendedor = localStorage.getItem('villaticket_email');

        try {
            // A) Capturar los inputs de archivos
            const inputImagenPrincipal = document.getElementById('imagenPrincipal');
            const inputGaleria = document.getElementById('galeriaImagenes');

            let urlPrincipal = '';
            let urlsGaleria = [];

            // B) Subir obligatoriamente la imagen principal al servidor
            if (inputImagenPrincipal.files.length > 0) {
                urlPrincipal = await subirImagen(inputImagenPrincipal.files[0]);
            } else {
                throw new Error("Debes subir una imagen principal para el evento.");
            }

            // C) Iterar y subir las imágenes de la galería (si el usuario seleccionó alguna)
            if (inputGaleria.files.length > 0) {
                for (let i = 0; i < inputGaleria.files.length; i++) {
                    const url = await subirImagen(inputGaleria.files[i]);
                    urlsGaleria.push(url);
                }
            }

            // D) Formatear la hora para asegurar el patrón HH:mm:ss que exige Java LocalTime
            let horaFormateada = document.getElementById('hora').value;
            if (horaFormateada.split(':').length === 2) {
                horaFormateada += ":00";
            }

            // E) Construir el DTO final combinando los textos con las URLs devueltas por el backend
            const data = {
                titulo: document.getElementById('titulo').value,
                descripcion: document.getElementById('descripcion').value, // Nuevo campo enviado
                fecha: document.getElementById('fecha').value,
                hora: horaFormateada,
                ubicacion: document.getElementById('ubicacion').value,
                categoriaId: document.getElementById('categoriaId').value,
                imagen: urlPrincipal, // Se envía la ruta estática final
                galeria: urlsGaleria, // Array de URLs estáticas
                vendedorEmail: emailVendedor
            };

            // F) Crear el evento en la base de datos
            const token = Auth.obtenerToken();
            const response = await fetch(`${API_URL}/eventos/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al registrar el evento en la base de datos");
            }

            // Si el backend devuelve el objeto creado, podemos extraer el ID para ir a crear sus zonas.
            const eventoCreado = await response.json();

            alert("¡Evento y galería guardados con éxito en estado Borrador!");

            // Redirigir directamente al panel de creación de zonas usando el ID devuelto
            window.location.href = `gestionar-zonas.html?id=${eventoCreado.id}`;

        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Guardar Evento y Continuar';
        }
    });
});