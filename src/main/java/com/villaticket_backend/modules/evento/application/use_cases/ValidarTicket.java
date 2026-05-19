package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.TicketEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ValidarTicket {

    @Autowired
    private JpaTicketRepository ticketRepository;

    public Map<String, Object> ejecutar(String codigoQr) {
        Map<String, Object> respuesta = new HashMap<>();
        TicketEntity ticket = ticketRepository.findByCodigoQr(codigoQr);
        if (ticket == null) {
            respuesta.put("valido", false);
            respuesta.put("mensaje", "❌ QR Inválido: Ticket no encontrado en el sistema.");
            return respuesta;
        }


        if ("USADO".equalsIgnoreCase(ticket.getEstado())) {
            respuesta.put("valido", false);
            respuesta.put("mensaje", "⚠️ ALERTA: Este ticket ya fue escaneado anteriormente.");
            respuesta.put("asistente", ticket.getNombreAsistente());
            return respuesta;
        }


        ticket.setEstado("USADO");
        ticketRepository.save(ticket);

        respuesta.put("valido", true);
        respuesta.put("mensaje", "✅ ACCESO PERMITIDO");
        respuesta.put("asistente", ticket.getNombreAsistente());
        respuesta.put("documento", ticket.getDocumentoAsistente());
        respuesta.put("zona", ticket.getZona().getNombre());

        return respuesta;
    }
}