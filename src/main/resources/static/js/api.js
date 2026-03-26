// js/api.js
const API_URL = 'http://localhost:8080/api'; // Ajusta esto a la ruta real de tu Backend

// Función genérica para hacer peticiones JSON
async function fetchAPI(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    const options = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);

        // Si el backend devuelve un error (400, 401, 500)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error en la petición: ${response.status}`);
        }

        // Si la respuesta es vacía (ej. 204 No Content), no intentamos parsear JSON
        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        console.error("Fetch API Error:", error);
        throw error;
    }
}