document.addEventListener('DOMContentLoaded', async () => {

    if (!Auth.estaAutenticado() || Auth.obtenerRol() !== 'VENDEDOR') {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('btnCerrarSesion').addEventListener('click', (e) => {
        e.preventDefault();
        Auth.cerrarSesion();
    });

    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    if (!eventoId || eventoId === 'undefined' || eventoId === 'null') {
        alert("Error: No se ha especificado un evento válido.");
        window.location.href = 'dashboard-vendedor.html';
        return;
    }

    const formCrearZona = document.getElementById('formCrearZona');
    const tbodyZonas = document.getElementById('tbodyZonas');
    const btnSubmit = document.getElementById('btnSubmitZona');
    const tituloFormulario = document.getElementById('tituloFormulario');

    let editandoZonaId = null; // Si tiene un ID, estamos editando. Si es null, estamos creando.

    async function cargarZonas() {
        try {
            const zonas = await fetchAPI(`/zonas/evento/${eventoId}`, 'GET');
            tbodyZonas.innerHTML = '';

            if (!zonas || zonas.length === 0) {
                tbodyZonas.innerHTML = `<tr><td colspan="4" style="padding: 15px; text-align: center; color: #888;">No hay zonas creadas.</td></tr>`;
                return;
            }

            zonas.forEach(zona => {
                const nombre = zona.nombre || 'Sin nombre';
                const capacidad = zona.capacidadTotal || 0;
                const precio = zona.precio ? zona.precio.toFixed(2) : '0.00';

                tbodyZonas.innerHTML += `
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px;">${nombre}</td>
                        <td style="padding: 10px;">${capacidad}</td>
                        <td style="padding: 10px;">${precio} €</td>
                        <td style="padding: 10px;">
                            <button style="background: transparent; border: 1px solid #555; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;"
                                    onclick="prepararEdicion(${zona.id}, '${nombre}', ${capacidad}, ${zona.precio})">
                                ✏️ Editar
                            </button>
                            <button style="background: #ff4757; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer;"
                                    onclick="eliminarZona(${zona.id})">
                                🗑️ Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            tbodyZonas.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #ff4757;">Error al cargar las zonas.</td></tr>`;
        }
    }

    // Manejo del envío del formulario (Crear o Actualizar)
    if (formCrearZona) {
        formCrearZona.addEventListener('submit', async (e) => {
            e.preventDefault();
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Guardando...';

            const datosZona = {
                eventoId: parseInt(eventoId),
                nombre: document.getElementById('nombreZona').value,
                capacidadTotal: parseInt(document.getElementById('capacidadZona').value),
                precio: parseFloat(document.getElementById('precioZona').value)
            };

            try {
                if (editandoZonaId) {
                    // PUT para Actualizar
                    await fetchAPI(`/zonas/${editandoZonaId}`, 'PUT', datosZona);
                    alert('Zona actualizada con éxito.');
                } else {
                    // POST para Crear
                    await fetchAPI('/zonas', 'POST', datosZona);
                    alert('Zona creada con éxito.');
                }

                // Limpiar formulario y restaurar modo "Crear"
                formCrearZona.reset();
                editandoZonaId = null;
                tituloFormulario.textContent = 'Añadir Nueva Zona';
                btnSubmit.textContent = 'Añadir Zona';

                await cargarZonas();
            } catch (error) {
                alert(`Error: ${error.message}`);
            } finally {
                btnSubmit.disabled = false;
            }
        });
    }

    // Función para subir los datos de la tabla al formulario
    window.prepararEdicion = function(id, nombre, capacidad, precio) {
        document.getElementById('nombreZona').value = nombre;
        document.getElementById('capacidadZona').value = capacidad;
        document.getElementById('precioZona').value = precio;

        editandoZonaId = id; // Entramos en modo edición
        tituloFormulario.textContent = 'Editar Zona';
        btnSubmit.textContent = 'Actualizar Zona';

        // Hacemos scroll hacia arriba para que el usuario vea el formulario
        document.getElementById('nombreZona').focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Función para eliminar zona
    window.eliminarZona = async function(idZona) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta zona?')) return;
        try {
            await fetchAPI(`/zonas/${idZona}`, 'DELETE');
            await cargarZonas();
        } catch (error) {
            alert(`Error al eliminar: ${error.message}`);
        }
    };

    await cargarZonas();
});