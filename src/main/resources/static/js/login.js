document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const btnSubmit = loginForm.querySelector('button[type="submit"]');
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

            // LOG DE DEPURACIÓN: Aquí veremos qué manda el servidor exactamente
            console.log("Respuesta completa del servidor:", data);

            if (response.ok) {
                localStorage.clear();

                // Intentamos obtener el rol de varias formas por si el nombre cambia
                const rolDetectado = data.role || data.rol || "CLIENTE";

                localStorage.setItem(Auth.TOKEN_KEY, data.token);
                localStorage.setItem(Auth.EMAIL_KEY, data.email);
                localStorage.setItem(Auth.ROLE_KEY, rolDetectado);

                console.log("Sesión guardada. Rol final:", rolDetectado);

                setTimeout(() => {
                    const rolFinal = rolDetectado.toUpperCase();
                    if (rolFinal.includes('VENDEDOR')) {
                        window.location.href = 'dashboard-vendedor.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 150);

            } else {
                alert(data.error || "Credenciales incorrectas.");
                btnSubmit.disabled = false;
                btnSubmit.textContent = "Iniciar sesión";
            }
        } catch (error) {
            console.error("Error crítico en login:", error);
            alert("Error de conexión con el servidor.");
            btnSubmit.disabled = false;
        }
    });
});