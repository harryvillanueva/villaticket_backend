// js/api.js
const API_URL = window.location.origin + '/api';

// Função genérica para fazer requisições JSON
async function fetchAPI(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    // --- A SOLUÇÃO ESTÁ AQUI ---
    // Pegamos o token do localStorage e adicionamos ao cabeçalho (Header) da requisição
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

        // Se o backend retorna um erro (400, 401, 403, 500)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error en la petición: ${response.status}`);
        }

        // Se a resposta for vazia (ex. 204 No Content), não tentamos fazer o parse do JSON
        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        console.error("Fetch API Error:", error);
        throw error;
    }
}