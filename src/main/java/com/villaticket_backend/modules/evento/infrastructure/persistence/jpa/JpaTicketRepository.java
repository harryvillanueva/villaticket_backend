package com.villaticket_backend.modules.evento.infrastructure.persistence.jpa;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.TicketEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JpaTicketRepository extends JpaRepository<TicketEntity, Long> {
    // Para que el cliente pueda ver todas las entradas que ha comprado
    List<TicketEntity> findByUsuario_Email(String email);

    // Para cuando el portero escanee el QR
    TicketEntity findByCodigoQr(String codigoQr);
}