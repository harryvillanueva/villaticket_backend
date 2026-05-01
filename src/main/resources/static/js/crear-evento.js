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

    // 3. Manejar el envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Publicando...';

        // Recuperar el email del vendedor desde LocalStorage
        // Si no tienes una función para el email en auth.js, asumimos que puedes guardarlo en el login
        const emailVendedor = localStorage.getItem('villaticket_email');

        const data = {
            titulo: document.getElementById('titulo').value,
            fecha: document.getElementById('fecha').value,
            hora: document.getElementById('hora').value + ":00", // Añadimos segundos para el formato LocalTime de Java
            ubicacion: document.getElementById('ubicacion').value,
            categoriaId: document.getElementById('categoriaId').value,
            imagen: document.getElementById('imagen').value || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30", // Imagen por defecto
            emailVendedor: emailVendedor
        };

        try {
            // Hacemos el Fetch inyectando el token manualmente por seguridad
            const token = Auth.obtenerToken();
            const response = await fetch(`${API_URL}/eventos/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Inyectamos el JWT
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al crear el evento");
            }

            alert("¡Evento publicado con éxito en la cartelera!");
            window.location.href = 'index.html'; // Redirigimos a la cartelera pública

        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Publicar Evento';
        }
    });
});