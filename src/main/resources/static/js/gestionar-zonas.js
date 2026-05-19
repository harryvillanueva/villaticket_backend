document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    if (!eventoId) {
        showToast("No se encontró el ID del evento", "error");
        window.location.href = 'dashboard-vendedor.html';
        return;
    }

    const formCrearZona = document.getElementById('formCrearZona');
    const tbodyZonas = document.getElementById('tbodyZonas');
    const tituloFormulario = document.getElementById('tituloFormulario');
    const btnSubmitZona = document.getElementById('btnSubmitZona');

    let modoEdicion = false;
    let zonaIdEdicion = null;

    // --- 1. CONFIGURACIÓN INICIAL  ---
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.cerrarSesion();
        });
    }

    // --- 2. CARGAR NOMBRE DEL EVENTO ---
    try {
        const evento = await fetchAPI(`/eventos/${eventoId}`, 'GET');
        const subtitulo = document.querySelector('.auth-subtitle');
        if (subtitulo) {
            subtitulo.innerHTML = `Gestionando zonas para: <strong>${evento.titulo}</strong>`;
        }
    } catch (error) {
        console.error("Error al obtener nombre del evento:", error);
    }

    // --- 3. CARGAR LISTADO DE ZONAS ---
    async function cargarZonas() {
        try {
            const zonas = await fetchAPI(`/zonas/evento/${eventoId}`, 'GET');
            tbodyZonas.innerHTML = '';

            if (zonas.length === 0) {
                tbodyZonas.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; color: #888;">No hay zonas configuradas para este evento.</td></tr>';
                return;
            }

            zonas.forEach(zona => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid #333';
                tr.innerHTML = `
                    <td style="padding: 12px;">${zona.nombre}</td>
                    <td style="padding: 12px;">${zona.capacidadTotal}</td>
                    <td style="padding: 12px;">${zona.precio.toFixed(2)} €</td>
                    <td style="padding: 12px; display: flex; gap: 10px;">
                        <button class="btn-edit" onclick="prepararEdicion(${zona.id}, '${zona.nombre}', ${zona.capacidadTotal}, ${zona.precio})"
                                style="background: #fbbf24; color: #000; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                            Editar
                        </button>
                        <button class="btn-delete" onclick="eliminarZona(${zona.id})"
                                style="background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">
                            Eliminar
                        </button>
                    </td>
                `;
                tbodyZonas.appendChild(tr);
            });
        } catch (error) {
            showToast("Error al cargar las zonas.", "error");
        }
    }

    // --- 4. PREPARAR EDICIÓN ---
    window.prepararEdicion = (id, nombre, capacidad, precio) => {
        modoEdicion = true;
        zonaIdEdicion = id;
        tituloFormulario.textContent = "Editar Zona";
        btnSubmitZona.textContent = "Actualizar Zona";

        document.getElementById('nombreZona').value = nombre;
        document.getElementById('capacidadZona').value = capacidad;
        document.getElementById('precioZona').value = precio;
        document.querySelector('.auth-card').scrollIntoView({ behavior: 'smooth' });
    };

    // --- 5. CREAR O EDITAR  ---
    formCrearZona.addEventListener('submit', async (e) => {
        e.preventDefault();

        toggleSpinner('btnSubmitZona', true);

        const datos = {
            eventoId: parseInt(eventoId),
            nombre: document.getElementById('nombreZona').value,
            capacidadTotal: parseInt(document.getElementById('capacidadZona').value),
            precio: parseFloat(document.getElementById('precioZona').value)
        };

        try {
            if (modoEdicion) {
                await fetchAPI(`/zonas/${zonaIdEdicion}`, 'PUT', {
                    nombre: datos.nombre,
                    capacidadTotal: datos.capacidadTotal,
                    precio: datos.precio
                });
                showToast("Zona actualizada correctamente.", "success");
            } else {
                await fetchAPI('/zonas', 'POST', datos);
                showToast("Nueva zona añadida.", "success");
            }

            formCrearZona.reset();
            modoEdicion = false;
            zonaIdEdicion = null;
            tituloFormulario.textContent = "Añadir Nueva Zona";
            btnSubmitZona.textContent = "Añadir Zona";

            cargarZonas();
        } catch (error) {
            showToast(error.message, "error");
        } finally {
            toggleSpinner('btnSubmitZona', false);
        }
    });

    // --- 6. ELIMINAR ZONA ---
    window.eliminarZona = async (id) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta zona?")) return;

        try {
            await fetchAPI(`/zonas/${id}`, 'DELETE');
            showToast("Zona eliminada.", "info");
            cargarZonas();
        } catch (error) {
            showToast("No se pudo eliminar la zona.", "error");
        }
    };


    cargarZonas();
});