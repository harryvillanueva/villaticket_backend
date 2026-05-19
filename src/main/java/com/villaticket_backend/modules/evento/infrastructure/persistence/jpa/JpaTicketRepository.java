package com.villaticket_backend.modules.evento.infrastructure.persistence.jpa;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JpaTicketRepository extends JpaRepository<TicketEntity, Long> {
    List<TicketEntity> findByUsuario_Email(String email);
    TicketEntity findByCodigoQr(String codigoQr);

}