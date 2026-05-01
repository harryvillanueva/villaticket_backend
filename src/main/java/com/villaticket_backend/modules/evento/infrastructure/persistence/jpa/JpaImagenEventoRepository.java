package com.villaticket_backend.modules.evento.infrastructure.persistence.jpa;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ImagenEventoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaImagenEventoRepository extends JpaRepository<ImagenEventoEntity, Long> {

    /**
     * Este método le dice a Spring Boot que busque todas las imágenes
     * asociadas a un evento en particular, utilizando el ID de dicho evento.
     *
     * Además, la parte "OrderByOrdenAsc" le indica a la base de datos que
     * devuelva la lista ordenada desde la primera imagen hasta la última,
     * garantizando que la galería se vea en el orden correcto en el HTML.
     */
    List<ImagenEventoEntity> findByEvento_IdOrderByOrdenAsc(Long eventoId);

}