package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublicarEvento {

    @Autowired
    private JpaEventoRepository eventoRepository;

    @Transactional
    public EventoEntity ejecutar(Long id) {
        // Buscamos el evento por su ID
        EventoEntity evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error: Evento no encontrado en la base de datos"));

        // Cambiamos el estado cumpliendo con la regla de negocio del TFG
        evento.setEstado("PUBLICADO");

        return eventoRepository.save(evento);
    }
}