document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Si ya tiene sesión, redirigir según el flujo inteligente
    if (Auth.estaAutenticado()) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPage = urlParams.get('redirect');

        if (redirectPage) {
            window.location.href = decodeURIComponent(redirectPage);
        } else {
            const role = Auth.obtenerRol();
            window.location.href = (role === 'VENDEDOR') ? 'dashboard-vendedor.html' : 'index.html';
        }
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const btnSubmit = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = btnSubmit.textContent;
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Verificando...";

        try {
            const baseUrl = window.location.origin + '/api';

            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar usando las constantes de Auth para evitar errores de dedo
                localStorage.setItem(Auth.TOKEN_KEY, data.token);
                localStorage.setItem(Auth.EMAIL_KEY, data.email);
                localStorage.setItem(Auth.ROLE_KEY, data.role);

                // Pequeña espera para que el navegador asiente los datos
                setTimeout(() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirectPage = urlParams.get('redirect');

                    if (redirectPage) {
                        window.location.href = decodeURIComponent(redirectPage);
                    } else {
                        window.location.href = (data.role === 'VENDEDOR') ? 'dashboard-vendedor.html' : 'index.html';
                    }
                }, 100);

            } else {
                alert(data.error || "Credenciales incorrectas.");
                btnSubmit.disabled = false;
                btnSubmit.textContent = originalBtnText;
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
            btnSubmit.disabled = false;
            btnSubmit.textContent = originalBtnText;
        }
    });
});