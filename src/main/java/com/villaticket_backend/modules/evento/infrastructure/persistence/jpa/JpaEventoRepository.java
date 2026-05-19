package com.villaticket_backend.modules.evento.infrastructure.persistence.jpa;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JpaEventoRepository extends JpaRepository<EventoEntity, Long> {
    List<EventoEntity> findByVendedor_Email(String email);
    List<EventoEntity> findByEstado(String estado);
    Page<EventoEntity> findByEstado(String estado, Pageable pageable);
}