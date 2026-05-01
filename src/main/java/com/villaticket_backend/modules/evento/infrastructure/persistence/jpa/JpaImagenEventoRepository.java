package com.villaticket_backend.modules.evento.infrastructure.persistence.jpa;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ImagenEventoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaImagenEventoRepository extends JpaRepository<ImagenEventoEntity, Long> {
}