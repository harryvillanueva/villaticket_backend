package com.villaticket_backend.modules.evento.infrastructure.persistence.jpa;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ImagenEventoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaImagenEventoRepository extends JpaRepository<ImagenEventoEntity, Long> {

    // Usamos @Query para decirle a Spring exactamente cómo buscar las imágenes de un evento
    @Query("SELECT i FROM ImagenEventoEntity i WHERE i.evento.id = :eventoId ORDER BY i.orden ASC")
    List<ImagenEventoEntity> findByEvento_IdOrderByOrdenAsc(@Param("eventoId") Long eventoId);

}