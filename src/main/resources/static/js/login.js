// js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorDiv = document.getElementById('loginError');
    const btnSubmit = document.getElementById('btnLogin');

    // Si ya está logueado, mandarlo al index
    if (Auth.estaAutenticado()) {
        window.location.href = 'index.html';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        errorDiv.style.display = 'none';
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Verificando...';

        const data = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            // Suponiendo que tu endpoint devuelve { token: "ey...", rol: "CLIENTE" }
            const response = await fetchAPI('/auth/login', 'POST', data);

            // Guardamos el JWT en localStorage usando auth.js
            Auth.guardarSesion(response.token, response.rol);

            // Redirigimos según el rol (si es vendedor, quizá quieras mandarlo a un dashboard)
            if(response.rol === 'VENDEDOR') {
                window.location.href = 'crear-evento.html'; // O panel de vendedor
            } else {
                window.location.href = 'index.html'; // Cartelera para clientes
            }

        } catch (error) {
            errorDiv.textContent = 'Credenciales incorrectas o error en el servidor.';
            errorDiv.style.display = 'block';
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Entrar';
        }
    });
});