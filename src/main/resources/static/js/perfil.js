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

    // Asignación de IDs dinámicos para los botones de envío si no los tienen
    const btnPerfil = document.querySelector('#perfilForm button[type="submit"]');
    if (btnPerfil && !btnPerfil.id) btnPerfil.id = 'btnGuardarPerfil';

    const btnPass = document.querySelector('#passwordForm button[type="submit"]');
    if (btnPass && !btnPass.id) btnPass.id = 'btnCambiarPass';

    let currentUrlAvatar = '';

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
        showToast("Error al cargar datos del perfil", "error");
    }

    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = Auth.obtenerToken();
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) {
                if(response.status === 403) throw new Error("No tienes permiso para subir archivos (403)");
                throw new Error("Error en la subida del servidor");
            }

            const data = await response.json();
            currentUrlAvatar = data.url;
            avatarPreview.src = data.url;
            showToast("Previsualización cargada. Haz clic en 'Actualizar' para guardar.", "info");

        } catch (error) {
            showToast("Error al procesar la imagen", "error");
        }
    });

    document.getElementById('perfilForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        toggleSpinner('btnGuardarPerfil', true);

        const request = {
            nombre: document.getElementById('perfilNombre').value,
            urlAvatar: currentUrlAvatar,
            iban: inputIban ? inputIban.value : null
        };

        try {
            await fetchAPI('/users/profile', 'PUT', request);
            showToast("¡Perfil actualizado con éxito!", "success");

            if (userAvatarMenu && currentUrlAvatar) {
                userAvatarMenu.src = currentUrlAvatar;
                userAvatarMenu.style.display = 'block';
            }
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            toggleSpinner('btnGuardarPerfil', false);
        }
    });

    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        toggleSpinner('btnCambiarPass', true);

        const request = {
            passwordActual: document.getElementById('passActual').value,
            passwordNueva: document.getElementById('passNueva').value
        };
        try {
            await fetchAPI('/users/profile/password', 'PUT', request);
            showToast("Contraseña actualizada. Inicia sesión de nuevo.", "success");
            setTimeout(() => Auth.cerrarSesion(), 2000);
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            toggleSpinner('btnCambiarPass', false);
        }
    });
});