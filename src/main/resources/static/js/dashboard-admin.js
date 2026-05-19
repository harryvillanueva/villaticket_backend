document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.estaAutenticado() || !Auth.obtenerRol().toUpperCase().includes('ADMIN')) {
        showToast("Acceso Restringido. Esta área es exclusiva para Administradores.", "error");
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }
    cargarTodoElPanel();
});

async function cargarTodoElPanel() {
    await cargarEstadisticas();
    await cargarRetirosAdmin();
    await cargarCategorias();
    await cargarEventos();
    await cargarUsuarios();
}

// --- 1. ESTADÍSTICAS GLOBALES ---
async function cargarEstadisticas() {
    try {
        const stats = await fetchAPI('/admin/estadisticas', 'GET');
        document.getElementById('statGanancias').textContent = `${stats.gananciasPlataforma.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} €`;
        document.getElementById('statVentas').textContent = `${stats.totalRecaudado.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} €`;
        document.getElementById('statTickets').textContent = stats.totalTickets.toLocaleString();
    } catch (e) {
        console.error("Error estadísticas:", e);
    }
}

// --- 2. FINANZAS: GESTIÓN DE RETIROS ---
async function cargarRetirosAdmin() {
    const tabla = document.getElementById('tablaRetirosAdmin');
    tabla.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando solicitudes...</td></tr>';
    try {
        const retiros = await fetchAPI('/admin/retiros', 'GET');
        tabla.innerHTML = '';
        if(retiros.length === 0) {
            tabla.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay solicitudes de retiro pendientes.</td></tr>';
            return;
        }

        retiros.forEach(r => {
            let estadoHtml = r.estado;
            let botonAccion = '';

            if (r.estado === 'PENDIENTE') {
                estadoHtml = '<span class="badge badge-borrador">PENDIENTE</span>';
                botonAccion = `<button onclick="aprobarRetiro(${r.id})" style="background: #4ade80; color: #14532d; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Aprobar Pago</button>`;
            } else {
                estadoHtml = `<span class="badge badge-publicado">${r.estado}</span>`;
                botonAccion = '<span style="color:#888;">Procesado</span>';
            }

            tabla.innerHTML += `
                <tr>
                    <td><strong>${r.vendedorNombre}</strong><br><small style="color:#a1a1aa;">${r.vendedorEmail}</small></td>
                    <td style="color:#4ade80; letter-spacing: 1px;">${r.iban || 'Sin IBAN'}</td>
                    <td style="font-weight:bold; font-size: 1.1rem;">${r.monto.toFixed(2)} €</td>
                    <td>${estadoHtml}</td>
                    <td>${botonAccion}</td>
                </tr>
            `;
        });
    } catch (e) {
        tabla.innerHTML = '<tr><td colspan="5" style="color: #ff4757;">Error al cargar retiros</td></tr>';
    }
}

async function aprobarRetiro(id) {
    if (!confirm("💳 ¿Has realizado la transferencia bancaria al IBAN del vendedor? Al aceptar, el retiro se marcará como APROBADO en el sistema.")) return;
    try {
        await fetchAPI(`/admin/retiros/${id}/aprobar`, 'PUT');
        showToast("Retiro aprobado exitosamente.", "success");
        cargarTodoElPanel();
    } catch (error) {
        showToast("Error al aprobar: " + error.message, "error");
    }
}

// --- 3. GESTIÓN DE CATEGORÍAS ---
async function cargarCategorias() {
    const tabla = document.getElementById('tablaCategorias');
    tabla.innerHTML = '<tr><td colspan="3" style="text-align: center;">Cargando categorías...</td></tr>';
    try {
        const categorias = await fetchAPI('/eventos/categorias', 'GET');
        tabla.innerHTML = '';
        if(categorias.length === 0) {
            tabla.innerHTML = '<tr><td colspan="3" style="text-align: center;">No hay categorías registradas.</td></tr>';
            return;
        }
        categorias.forEach(cat => {
            tabla.innerHTML += `
                <tr>
                    <td>${cat.id}</td>
                    <td>${cat.nombre}</td>
                    <td>
                        <button onclick="eliminarCategoria(${cat.id})" style="background: #fca5a5; color: #7f1d1d; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        tabla.innerHTML = '<tr><td colspan="3" style="color: #ff4757;">Error al cargar las categorías</td></tr>';
    }
}

document.getElementById('formNuevaCat').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('nuevaCatNombre');
    const nombre = input.value.trim();
    if (!nombre) return;

    try {
        await fetchAPI('/admin/categorias', 'POST', { nombre: nombre });
        input.value = '';
        cargarCategorias();
    } catch (error) {
        showToast("Error al crear categoría: " + error.message, "error");
    }
});

async function eliminarCategoria(id) {
    if (!confirm("⚠️ ¿Estás completamente seguro de eliminar esta categoría? Si hay eventos usándola, podría causar errores visuales.")) return;
    try {
        await fetchAPI(`/admin/categorias/${id}`, 'DELETE');
        cargarCategorias();
    } catch (error) {
        showToast("No se pudo eliminar la categoría (es posible que haya eventos usándola en la base de datos).", "error");
    }
}

// --- 4. MODERACIÓN DE EVENTOS ---
async function cargarEventos() {
    const tabla = document.getElementById('tablaEventos');
    tabla.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando eventos...</td></tr>';
    try {
        const eventos = await fetchAPI('/admin/eventos', 'GET');
        tabla.innerHTML = '';

        if(eventos.length === 0) {
            tabla.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay eventos en la plataforma.</td></tr>';
            return;
        }

        eventos.forEach(ev => {
            let estadoHtml = '';
            let botonAccion = '';

            if (ev.estado === 'CANCELADO') {
                estadoHtml = '<span class="badge badge-cancelado">CANCELADO</span>';
                botonAccion = '<span style="color: #888; font-size: 0.9rem;">Sin acciones</span>';
            } else if (ev.estado === 'PUBLICADO') {
                estadoHtml = '<span class="badge badge-publicado">PUBLICADO</span>';
                botonAccion = `<button onclick="cancelarEvento(${ev.id})" style="background: #ff4757; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Dar de Baja</button>`;
            } else {
                estadoHtml = '<span class="badge badge-borrador">BORRADOR</span>';
                botonAccion = `<button onclick="cancelarEvento(${ev.id})" style="background: #ff4757; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Dar de Baja</button>`;
            }

            tabla.innerHTML += `
                <tr>
                    <td>${ev.id}</td>
                    <td><strong>${ev.titulo || 'Sin Título'}</strong></td>
                    <td>${ev.fecha || 'N/A'}</td>
                    <td>${ev.categoriaNombre || 'General'}</td>
                    <td>${estadoHtml}</td>
                    <td>${botonAccion}</td>
                </tr>
            `;
        });
    } catch (e) {
        tabla.innerHTML = '<tr><td colspan="6" style="color: #ff4757;">Error al cargar eventos</td></tr>';
    }
}

async function cancelarEvento(id) {
    if (!confirm("🚨 ATENCIÓN: ¿Seguro que deseas CANCELAR este evento? Los usuarios no podrán comprar más entradas y el vendedor no podrá publicarlo nuevamente.")) return;
    try {
        await fetchAPI(`/admin/eventos/${id}/cancelar`, 'PUT');
        showToast("El evento ha sido cancelado exitosamente por la Administración.", "success");
        cargarEventos();
    } catch (error) {
        showToast("Error al cancelar el evento: " + error.message, "error");
    }
}

// --- 5. GESTIÓN DE USUARIOS (NUEVO) ---
async function cargarUsuarios() {
    const tabla = document.getElementById('tablaUsuarios');
    if (!tabla) return;
    tabla.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando usuarios...</td></tr>';

    try {
        const usuarios = await fetchAPI('/admin/usuarios', 'GET');
        tabla.innerHTML = '';

        if(usuarios.length === 0) {
            tabla.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay usuarios registrados.</td></tr>';
            return;
        }

        usuarios.forEach(u => {
            let estadoHtml = u.activo ? '<span class="badge badge-publicado">ACTIVO</span>' : '<span class="badge badge-cancelado">BLOQUEADO</span>';
            let botonAccion = '';

            if (u.rol === 'ADMIN') {
                botonAccion = '<span style="color: #888; font-size: 0.9rem;">Súper Admin</span>';
            } else if (u.activo) {
                botonAccion = `<button onclick="bloquearUsuario(${u.id})" style="background: #ff4757; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Bloquear</button>`;
            } else {
                botonAccion = `<button onclick="activarUsuario(${u.id})" style="background: #4ade80; color: #14532d; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Activar</button>`;
            }

            tabla.innerHTML += `
                <tr>
                    <td>${u.id}</td>
                    <td><strong>${u.nombre}</strong></td>
                    <td>${u.email}</td>
                    <td><span class="badge" style="background: #374151;">${u.rol}</span></td>
                    <td>${estadoHtml}</td>
                    <td>${botonAccion}</td>
                </tr>
            `;
        });
    } catch (e) {
        tabla.innerHTML = '<tr><td colspan="6" style="color: #ff4757;">Error al cargar usuarios</td></tr>';
    }
}

async function bloquearUsuario(id) {
    if (!confirm("🚨 ATENCIÓN: ¿Seguro que deseas BLOQUEAR a este usuario? Perderá acceso inmediato a su cuenta y no podrá iniciar sesión.")) return;
    try {
        await fetchAPI(`/admin/usuarios/${id}/bloquear`, 'PUT');
        showToast("Usuario bloqueado exitosamente.", "success");
        cargarUsuarios();
    } catch (error) {
        showToast("Error al bloquear: " + error.message, "error");
    }
}

async function activarUsuario(id) {
    if (!confirm("✅ ¿Deseas REACTIVAR el acceso de este usuario a la plataforma?")) return;
    try {
        await fetchAPI(`/admin/usuarios/${id}/activar`, 'PUT');
        showToast("Usuario activado exitosamente.", "success");
        cargarUsuarios();
    } catch (error) {
        showToast("Error al activar: " + error.message, "error");
    }
}