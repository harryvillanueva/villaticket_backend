package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OcultarEvento {

    @Autowired
    private JpaEventoRepository eventoRepository;

    public EventoEntity ejecutar(Long id) {
        EventoEntity evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con ID: " + id));

        evento.setEstado("BORRADOR");
        return eventoRepository.save(evento);
    }
}