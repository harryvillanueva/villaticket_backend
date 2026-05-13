document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    const registroError = document.getElementById('registroError');

    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (registroError) registroError.textContent = '';

            toggleSpinner('btnRegistro', true);

            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rol = document.getElementById('rol').value;

            try {
                await fetchAPI('/users/register', 'POST', {
                    nombre,
                    email,
                    password,
                    rol
                });

                showToast("¡Cuenta creada! Redirigiendo al login...", "success");

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } catch (error) {
                showToast(error.message, "error");
                if (registroError) registroError.textContent = error.message;
                toggleSpinner('btnRegistro', false);
            }
        });
    }
});