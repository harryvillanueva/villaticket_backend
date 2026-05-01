package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.EventoDTO;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ObtenerEvento {

    @Autowired
    private JpaEventoRepository eventoRepository;

    public EventoDTO execute(Long id) {
        EventoEntity entity = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        return new EventoDTO(
                entity.getId(),
                entity.getTitulo(),
                entity.getFecha(),
                entity.getHora(),
                entity.getUbicacion(),
                entity.getImagen(),
                entity.getCategoria().getNombre(),
                entity.getEstado(),
                entity.getDescripcion(),
                entity.getGaleria()
        );
    }
}