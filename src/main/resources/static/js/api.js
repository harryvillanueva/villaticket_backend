// js/api.js
const API_URL = window.location.origin + '/api';

// Función genérica para hacer peticiones JSON al Backend
async function fetchAPI(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    // Extraemos el token del almacenamiento y lo enviamos en los Headers
    const token = localStorage.getItem('villaticket_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);

        if (!response.ok) {
            // --- NUEVO: Interceptor de Sesión Expirada (Protección contra 401/403) ---
            if (response.status === 401 || response.status === 403) {
                alert("Tu sesión ha expirado por seguridad o no tienes permisos. Por favor, inicia sesión nuevamente.");
                localStorage.clear(); // Limpiamos la sesión vieja
                window.location.href = 'login.html'; // Lo mandamos a loguearse
                throw new Error("Sesión expirada");
            }

            const errorData = await response.json().catch(() => ({}));
            // Tomamos errorData.message o errorData.error dependiendo de lo que mande Spring
            throw new Error(errorData.message || errorData.error || `Error en la petición: ${response.status}`);
        }

        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        console.error("Fetch API Error:", error);
        throw error;
    }
}