package com.villaticket_backend.modules.evento.infrastructure.persistence.jpa;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ImagenEventoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaEventoRepository extends JpaRepository<EventoEntity, Long> {

    // Busca los eventos por el email del vendedor
    List<EventoEntity> findByVendedor_Email(String email);

    // NUEVO: Busca los eventos por su estado (ej. "PUBLICADO")
    List<EventoEntity> findByEstado(String estado);

    List<ImagenEventoEntity> findByEvento_IdOrderByOrdenAsc(Long eventoId);
}