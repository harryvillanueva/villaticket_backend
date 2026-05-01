package com.villaticket_backend.modules.evento.infrastructure.persistence.jpa;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaEventoRepository extends JpaRepository<EventoEntity, Long> {
    // Para cuando queramos mostrar la cartelera pública
    List<EventoEntity> findByEstado(String estado);

    // Para que el vendedor vea solo sus eventos creados
    List<EventoEntity> findByVendedorId(Long vendedorId);
}