document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (loginError) loginError.textContent = '';

        toggleSpinner('btnLogin', true);

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

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

                const authManager = window.Auth;
                const rolDetectado = data.role || data.rol || "CLIENTE";

                localStorage.setItem(authManager.TOKEN_KEY, data.token);
                localStorage.setItem(authManager.EMAIL_KEY, data.email);
                localStorage.setItem(authManager.ROLE_KEY, rolDetectado);

                showToast("¡Sesión iniciada correctamente!", "success");

                setTimeout(() => {
                    if (rolDetectado.toUpperCase().includes('ADMIN')) {
                        window.location.href = 'dashboard-admin.html';
                    } else if (rolDetectado.toUpperCase().includes('VENDEDOR')) {
                        window.location.href = 'dashboard-vendedor.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1500);

            } else {
                showToast(data.error || "Credenciales incorrectas.", "error");
                if (loginError) loginError.textContent = data.error || "Credenciales incorrectas.";
                toggleSpinner('btnLogin', false);
            }
        } catch (error) {
            showToast("Error de conexión con el servidor.", "error");
            toggleSpinner('btnLogin', false);
        }
    });
});