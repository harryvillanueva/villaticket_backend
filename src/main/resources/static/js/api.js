const API_URL = window.location.origin + '/api';

async function fetchAPI(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

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

        // --- MANEJO DE VALIDACIONES BEAN VALIDATION ---
        if (response.status === 400) {
            const errorData = await response.json();
            if(typeof errorData === 'object' && !errorData.error && !errorData.message) {
                // Tomamos el primer error de la lista de validación
                const firstError = Object.values(errorData)[0];
                throw new Error(firstError);
            }
            throw new Error(errorData.error || errorData.message || 'Error en los datos enviados.');
        }

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                alert("Tu sesión ha expirado por seguridad o no tienes permisos.");
                localStorage.clear(); 
                window.location.href = 'login.html'; 
                throw new Error("Sesión expirada");
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || errorData.error || `Error en la petición: ${response.status}`);
        }

        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        console.error("Fetch API Error:", error);
        throw error;
    }
}

// --- NUEVAS FUNCIONES DE UI ---
window.showToast = function(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = type === 'success' ? '✅ ' : (type === 'error' ? '❌ ' : 'ℹ️ ');
    toast.innerHTML = `<span>${icon} ${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOutRight 0.4s forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
};

window.toggleSpinner = function(buttonId, isLoading, originalText = '') {
    const btn = document.getElementById(buttonId);
    if (!btn) return;

    if (isLoading) {
        if (!btn.classList.contains('loading')) {
            btn.classList.add('loading');
            btn.setAttribute('data-original-text', btn.textContent);
            btn.innerHTML = `<span class="spinner"></span> Procesando...`;
        }
    } else {
        btn.classList.remove('loading');
        btn.textContent = originalText || btn.getAttribute('data-original-text');
    }
};