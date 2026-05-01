package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.CrearEventoRequest;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.CategoriaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaCategoriaRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class CrearEvento {

    @Autowired
    private JpaEventoRepository eventoRepository;

    @Autowired
    private JpaCategoriaRepository categoriaRepository;

    @Autowired
    private JpaUsuarioRepository usuarioRepository;

    public void execute(CrearEventoRequest request) {
        // 1. Validar que el vendedor existe
        UsuarioEntity vendedor = usuarioRepository.findByEmail(request.getEmailVendedor())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado con el email: " + request.getEmailVendedor()));

        // 2. Validar que la categoría existe
        CategoriaEntity categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada."));

        // 3. Crear la entidad Evento
        EventoEntity evento = new EventoEntity();
        evento.setTitulo(request.getTitulo());
        // Convertimos los Strings a objetos de Fecha y Hora de Java
        evento.setFecha(LocalDate.parse(request.getFecha()));
        evento.setHora(LocalTime.parse(request.getHora()));
        evento.setUbicacion(request.getUbicacion());
        evento.setImagen(request.getImagen());
        evento.setDescripcion(request.getDescripcion()); // NUEVO
        evento.setGaleria(request.getGaleria()); // NUEVO
        evento.setEstado("PUBLICADO"); // Por defecto lo publicamos directamente

        evento.setCategoria(categoria);
        evento.setVendedor(vendedor);

        // 4. Guardar en la base de datos
        eventoRepository.save(evento);
    }
}