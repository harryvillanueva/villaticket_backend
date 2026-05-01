document.addEventListener('DOMContentLoaded', () => {

    if (!Auth.estaAutenticado() || Auth.obtenerRol() !== 'VENDEDOR') {
        window.location.href = 'index.html';
        return;
    }

    // Obtener el ID del evento desde la URL (ej: gestionar-zonas.html?id=5)
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    if (!eventoId) {
        alert("No se especificó un evento.");
        window.location.href = 'dashboard-vendedor.html';
        return;
    }

    const form = document.getElementById('crearZonaForm');
    const listaZonas = document.getElementById('listaZonas');
    const errorDiv = document.getElementById('zonaError');

    // Función para cargar y pintar las zonas
    const cargarZonas = async () => {
        try {
            const zonas = await fetchAPI(`/zonas/evento/${eventoId}`, 'GET');
            listaZonas.innerHTML = '';

            if (zonas.length === 0) {
                listaZonas.innerHTML = '<p style="color: var(--text-muted);">No has añadido ninguna zona aún.</p>';
                return;
            }

            zonas.forEach(zona => {
                listaZonas.innerHTML += `
                    <div style="background-color: var(--bg-card); padding: 20px; border-radius: var(--radius); border: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="color: var(--primary); margin-bottom: 5px;">${zona.nombre}</h3>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">
                                Capacidad total: ${zona.capacidadTotal} | Disponibles: <strong>${zona.capacidadActual}</strong>
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <span style="font-size: 1.5rem; font-weight: bold; color: white;">${zona.precio} €</span>
                        </div>
                    </div>
                `;
            });
        } catch (error) {
            listaZonas.innerHTML = '<p style="color: #ff4757;">Error al cargar las zonas.</p>';
        }
    };

    // Función para guardar una nueva zona
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';

        const data = {
            nombre: document.getElementById('nombreZona').value,
            capacidad: parseInt(document.getElementById('capacidadZona').value),
            precio: parseFloat(document.getElementById('precioZona').value)
        };

        try {
            const token = Auth.obtenerToken();
            const response = await fetch(`${API_URL}/zonas/evento/${eventoId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Error al guardar la zona");

            form.reset(); // Limpiar formulario
            cargarZonas(); // Recargar la lista automáticamente

        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        }
    });

    // Cargar las zonas al abrir la página
    cargarZonas();
});