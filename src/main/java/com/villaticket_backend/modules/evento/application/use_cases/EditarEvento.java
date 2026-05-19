package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.EditarEventoRequest;
import com.villaticket_backend.modules.evento.application.dtos.EventoDTO; // Importar DTO
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.CategoriaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaCategoriaRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class EditarEvento {

    @Autowired
    private JpaEventoRepository eventoRepository;

    @Autowired
    private JpaCategoriaRepository categoriaRepository;

    @Transactional
    public EventoDTO ejecutar(Long id, EditarEventoRequest request) {
        EventoEntity evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        CategoriaEntity categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        evento.setTitulo(request.getTitulo());
        evento.setDescripcion(request.getDescripcion());
        evento.setFecha(LocalDate.parse(request.getFecha()));
        evento.setHora(LocalTime.parse(request.getHora()));
        evento.setUbicacion(request.getUbicacion());
        evento.setCategoria(categoria);

        if (request.getImagen() != null && !request.getImagen().isEmpty() && !request.getImagen().equals("null")) {
            evento.setImagen(request.getImagen());
        }

        EventoEntity guardado = eventoRepository.save(evento);


        EventoDTO dto = new EventoDTO();
        dto.setId(guardado.getId());
        dto.setTitulo(guardado.getTitulo());
        dto.setDescripcion(guardado.getDescripcion());
        dto.setImagenUrl(guardado.getImagen());
        dto.setFecha(guardado.getFecha().toString());
        dto.setHora(guardado.getHora().toString());
        dto.setUbicacion(guardado.getUbicacion());
        dto.setEstado(guardado.getEstado());
        dto.setCategoriaNombre(guardado.getCategoria().getNombre());

        return dto;
    }
}