// js/registro.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const errorDiv = document.getElementById('registroError');
    const btnSubmit = document.getElementById('btnRegistro');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página recargue

        // Limpiar errores previos
        errorDiv.style.display = 'none';
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Registrando...';

        // Capturar datos
        const data = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            rol: document.getElementById('rol').value
        };

        try {
            // Llamamos al backend usando nuestro api.js
            // Asegúrate de que este endpoint coincida con tu @PostMapping en Spring Boot
            await fetchAPI('/users/register', 'POST', data);

            // Si el registro es exitoso, lo mandamos al login
            alert('¡Cuenta creada con éxito! Por favor, inicia sesión.');
            window.location.href = 'login.html';

        } catch (error) {
            errorDiv.textContent = error.message || 'Ocurrió un error al registrar el usuario.';
            errorDiv.style.display = 'block';
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Registrarse';
        }
    });
});