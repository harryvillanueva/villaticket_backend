document.addEventListener('DOMContentLoaded', async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('id');

    const mensajeEstado = document.getElementById('mensajeEstado');
    const detalleContenedor = document.getElementById('detalleContenedor');

    if (!eventoId || eventoId === 'undefined' || eventoId === 'null') {
        mensajeEstado.innerHTML = '<span style="color: #ff4757;">Error: Evento no válido.</span>';
        setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        return;
    }

    try {
        const evento = await fetchAPI(`/eventos/${eventoId}`, 'GET');

        mensajeEstado.style.display = 'none';
        detalleContenedor.style.display = 'block';

        document.getElementById('eventoTitulo').textContent = evento.titulo || 'Evento sin título';
        document.getElementById('eventoCategoria').textContent = evento.categoriaNombre || 'General';
        document.getElementById('eventoFecha').textContent = evento.fecha || 'Por definir';
        document.getElementById('eventoHora').textContent = evento.hora || 'Por definir';
        document.getElementById('eventoUbicacion').textContent = evento.ubicacion || 'Por definir';
        document.getElementById('eventoDescripcion').textContent = evento.descripcion || 'Sin descripción disponible.';

        const imgElement = document.getElementById('eventoImagen');
        let imagenSrc = evento.imagenUrl || evento.imagen;

        if (imagenSrc && imagenSrc !== 'null' && imagenSrc !== 'undefined') {
            imgElement.src = imagenSrc;
        } else {
            imgElement.src = 'https://via.placeholder.com/900x400?text=Villaticket';
        }

        // --- NUEVO: Cargar Galería ---
        const galeriaContenedor = document.getElementById('eventoGaleria');
        galeriaContenedor.innerHTML = ''; // Limpiamos por seguridad

        if (evento.galeria && evento.galeria.length > 0) {
            evento.galeria.forEach(url => {
                // Previene que se pinten rutas nulas o vacías que se hayan colado en la BD
                if(url && url !== 'null') {
                    galeriaContenedor.innerHTML += `
                        <img src="${url}" class="galeria-img" alt="Imagen Galería" onerror="this.style.display='none'">
                    `;
                }
            });
        }

        // Si después del proceso el contenedor sigue vacío, mostramos mensaje
        if (galeriaContenedor.innerHTML === '') {
            galeriaContenedor.innerHTML = '<p style="color: #888; grid-column: 1/-1;">No hay imágenes adicionales en la galería.</p>';
        }

    } catch (error) {
        console.error("Error al cargar el evento:", error);
        mensajeEstado.innerHTML = `<span style="color: #ff4757;">Lo sentimos, no se pudo cargar la información del evento.</span>`;
    }
});