package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.EventoDTO;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ListarEventos {

    @Autowired
    private JpaEventoRepository eventoRepository;

    public List<EventoDTO> ejecutarPorVendedor(String email) {
        List<EventoEntity> entidades = eventoRepository.findByVendedor_Email(email);
        return mapearLista(entidades);
    }

    public List<EventoDTO> ejecutarPublicos() {
        List<EventoEntity> entidades = eventoRepository.findByEstado("PUBLICADO");
        return mapearLista(entidades);
    }


    public Page<EventoDTO> ejecutarPublicosPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EventoEntity> eventosPage = eventoRepository.findByEstado("PUBLICADO", pageable);

        return eventosPage.map(evento -> {
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
            return dto;
        });
    }

    private List<EventoDTO> mapearLista(List<EventoEntity> entidades) {
        List<EventoDTO> dtos = new ArrayList<>();
        for (EventoEntity evento : entidades) {
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
            dtos.add(dto);
        }
        return dtos;
    }
}