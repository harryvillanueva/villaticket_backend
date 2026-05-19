package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.EventoDTO;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ImagenEventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaImagenEventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ObtenerEvento {

    @Autowired
    private JpaEventoRepository eventoRepository;

    @Autowired
    private JpaImagenEventoRepository imagenEventoRepository;

    public EventoDTO ejecutar(Long id) {
        EventoEntity evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Evento no encontrado"));

        EventoDTO dto = new EventoDTO();
        dto.setId(evento.getId());
        dto.setTitulo(evento.getTitulo());
        dto.setDescripcion(evento.getDescripcion());
        dto.setImagenUrl(evento.getImagen());

        dto.setFecha(evento.getFecha() != null ? evento.getFecha().toString() : "Por definir");
        dto.setHora(evento.getHora() != null ? evento.getHora().toString() : "Por definir");
        dto.setUbicacion(evento.getUbicacion());
        dto.setEstado(evento.getEstado());

        if (evento.getCategoria() != null) {
            dto.setCategoriaNombre(evento.getCategoria().getNombre());
        } else {
            dto.setCategoriaNombre("Sin categoría");
        }


        List<ImagenEventoEntity> imagenes = imagenEventoRepository.findByEvento_IdOrderByOrdenAsc(id);
        List<String> galeriaUrls = new ArrayList<>();
        for (ImagenEventoEntity img : imagenes) {
            galeriaUrls.add(img.getUrlImagen());
        }
        dto.setGaleria(galeriaUrls);

        return dto;
    }
}