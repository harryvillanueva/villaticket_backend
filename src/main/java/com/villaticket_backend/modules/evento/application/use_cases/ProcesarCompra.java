package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.CompraRequest;
import com.villaticket_backend.modules.evento.application.dtos.TicketDTO;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.TicketEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ZonaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaTicketRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaZonaRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProcesarCompra {

    @Autowired private JpaUsuarioRepository usuarioRepository;
    @Autowired private JpaEventoRepository eventoRepository;
    @Autowired private JpaZonaRepository zonaRepository;
    @Autowired private JpaTicketRepository ticketRepository;

    @Transactional
    public List<TicketDTO> ejecutar(CompraRequest request) {

        // La cantidad a comprar ahora es el tamaño de la lista de asistentes
        int cantidadAComprar = request.getAsistentes().size();

        UsuarioEntity usuario = usuarioRepository.findByEmail(request.getUsuarioEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        EventoEntity evento = eventoRepository.findById(request.getEventoId())
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        ZonaEntity zona = zonaRepository.findById(request.getZonaId())
                .orElseThrow(() -> new RuntimeException("Zona no encontrada"));

        if (!zona.getEvento().getId().equals(evento.getId())) {
            throw new RuntimeException("La zona no pertenece a este evento");
        }

        if (zona.getCapacidadActual() < cantidadAComprar) {
            throw new RuntimeException("No hay suficientes entradas disponibles en esta zona.");
        }

        // Restar stock
        zona.setCapacidadActual(zona.getCapacidadActual() - cantidadAComprar);
        zonaRepository.save(zona);

        List<TicketDTO> ticketsComprados = new ArrayList<>();

        // Iteramos sobre cada asistente enviado desde el frontend
        for (CompraRequest.AsistenteDTO asistente : request.getAsistentes()) {
            TicketEntity ticket = new TicketEntity();
            ticket.setCodigoQr(UUID.randomUUID().toString());
            ticket.setFechaCompra(LocalDateTime.now());
            ticket.setEstado("ACTIVO");
            ticket.setEvento(evento);
            ticket.setZona(zona);
            ticket.setUsuario(usuario);

            // Asignamos los datos nominativos
            ticket.setNombreAsistente(asistente.getNombre());
            ticket.setDocumentoAsistente(asistente.getDocumento());

            TicketEntity ticketGuardado = ticketRepository.save(ticket);

            TicketDTO dto = new TicketDTO();
            dto.setId(ticketGuardado.getId());
            dto.setCodigoQr(ticketGuardado.getCodigoQr());
            dto.setEstado(ticketGuardado.getEstado());
            dto.setEventoTitulo(evento.getTitulo());
            dto.setEventoFecha(evento.getFecha().toString());
            dto.setEventoHora(evento.getHora().toString());
            dto.setZonaNombre(zona.getNombre());
            dto.setPrecioPagado(zona.getPrecio());

            // Pasamos los datos al DTO para que el frontend los vea
            dto.setNombreAsistente(ticketGuardado.getNombreAsistente());
            dto.setDocumentoAsistente(ticketGuardado.getDocumentoAsistente());

            ticketsComprados.add(dto);
        }

        return ticketsComprados;
    }
}