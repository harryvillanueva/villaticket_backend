document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const btnSubmit = document.getElementById('btnLogin');

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
                localStorage.clear();

                // Usamos window.Auth para asegurar que lo encuentre
                const authManager = window.Auth;

                const rolDetectado = data.role || data.rol || "CLIENTE";

                localStorage.setItem(authManager.TOKEN_KEY, data.token);
                localStorage.setItem(authManager.EMAIL_KEY, data.email);
                localStorage.setItem(authManager.ROLE_KEY, rolDetectado);

                console.log("Login exitoso. Redirigiendo...");

                setTimeout(() => {
                    if (rolDetectado.toUpperCase().includes('VENDEDOR')) {
                        window.location.href = 'dashboard-vendedor.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 100);

            } else {
                alert(data.error || "Credenciales incorrectas.");
                btnSubmit.disabled = false;
                btnSubmit.textContent = "Iniciar sesión";
            }
        } catch (error) {
            console.error("Error en login:", error);
            alert("Error de conexión con el servidor.");
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Iniciar sesión";
        }
    });
});