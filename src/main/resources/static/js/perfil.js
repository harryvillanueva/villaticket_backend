document.addEventListener('DOMContentLoaded', async () => {
    if (!Auth.estaAutenticado()) {
        window.location.href = 'login.html';
        return;
    }

    const avatarPreview = document.getElementById('avatarPreview');
    const avatarInput = document.getElementById('avatarInput');
    const seccionIban = document.getElementById('seccionIban');
    const inputIban = document.getElementById('perfilIban');
    const userAvatarMenu = document.getElementById('userAvatarMenu');

    let currentUrlAvatar = '';

    // 1. Cargar Datos del Perfil
    try {
        const perfil = await fetchAPI('/users/profile', 'GET');

        document.getElementById('perfilNombre').value = perfil.nombre || '';
        document.getElementById('perfilEmail').value = perfil.email || '';

        if (perfil.urlAvatar) {
            avatarPreview.src = perfil.urlAvatar;
            currentUrlAvatar = perfil.urlAvatar;
        }

        const rolUsuario = (perfil.rol || "").toUpperCase();
        if (rolUsuario.includes('VENDEDOR')) {
            seccionIban.style.display = 'block';
            if (inputIban) inputIban.value = perfil.iban || '';
        } else {
            seccionIban.style.display = 'none';
        }
    } catch (error) {
        console.error("Error al cargar perfil:", error);
    }

    // 2. Subida de Foto
    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = Auth.obtenerToken();
            // IMPORTANTE: No ponemos 'Content-Type' manual, el navegador lo hace por el FormData
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                if(response.status === 403) throw new Error("No tienes permiso para subir archivos (403)");
                throw new Error("Error en la subida del servidor");
            }

            const data = await response.json();
            currentUrlAvatar = data.url;
            avatarPreview.src = data.url;
            alert("Previsualización cargada. Haz clic en 'Actualizar Mis Datos' para guardar.");

        } catch (error) {
            console.error("Error en upload:", error);
            alert("Error: " + error.message);
        }
    });

    // 3. Guardar Cambios
    document.getElementById('perfilForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const request = {
            nombre: document.getElementById('perfilNombre').value,
            urlAvatar: currentUrlAvatar,
            iban: inputIban ? inputIban.value : null
        };

        try {
            await fetchAPI('/users/profile', 'PUT', request);
            alert("¡Perfil actualizado con éxito!");

            // Actualizar la foto del menú inmediatamente
            if (userAvatarMenu && currentUrlAvatar) {
                userAvatarMenu.src = currentUrlAvatar;
                userAvatarMenu.style.display = 'block';
            }

        } catch (error) {
            alert("Error al actualizar: " + error.message);
        }
    });

    // 4. Cambiar Contraseña
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const request = {
            passwordActual: document.getElementById('passActual').value,
            passwordNueva: document.getElementById('passNueva').value
        };
        try {
            await fetchAPI('/users/profile/password', 'PUT', request);
            alert("Contraseña actualizada. Inicia sesión de nuevo.");
            Auth.cerrarSesion();
        } catch (error) {
            alert(error.message);
        }
    });
});