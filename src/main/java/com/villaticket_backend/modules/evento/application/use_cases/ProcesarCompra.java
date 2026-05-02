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

        // 1. Buscamos al usuario comprador
        UsuarioEntity usuario = usuarioRepository.findByEmail(request.getUsuarioEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Buscamos el evento y la zona
        EventoEntity evento = eventoRepository.findById(request.getEventoId())
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        ZonaEntity zona = zonaRepository.findById(request.getZonaId())
                .orElseThrow(() -> new RuntimeException("Zona no encontrada"));

        // 3. Verificamos que la zona pertenezca al evento
        if (!zona.getEvento().getId().equals(evento.getId())) {
            throw new RuntimeException("La zona no pertenece a este evento");
        }

        // 4. Verificamos si hay stock (capacidad actual)
        if (zona.getCapacidadActual() < request.getCantidad()) {
            throw new RuntimeException("No hay suficientes entradas disponibles en esta zona. Quedan: " + zona.getCapacidadActual());
        }

        // 5. Restamos el stock
        zona.setCapacidadActual(zona.getCapacidadActual() - request.getCantidad());
        zonaRepository.save(zona);

        // 6. Generamos los tickets solicitados
        List<TicketDTO> ticketsComprados = new ArrayList<>();

        for (int i = 0; i < request.getCantidad(); i++) {
            TicketEntity ticket = new TicketEntity();
            // UUID.randomUUID() genera un código como este: "123e4567-e89b-12d3-a456-426614174000"
            ticket.setCodigoQr(UUID.randomUUID().toString());
            ticket.setFechaCompra(LocalDateTime.now());
            ticket.setEstado("ACTIVO");
            ticket.setEvento(evento);
            ticket.setZona(zona);
            ticket.setUsuario(usuario);

            TicketEntity ticketGuardado = ticketRepository.save(ticket);

            // Convertimos a DTO para responder al frontend
            TicketDTO dto = new TicketDTO();
            dto.setId(ticketGuardado.getId());
            dto.setCodigoQr(ticketGuardado.getCodigoQr());
            dto.setEstado(ticketGuardado.getEstado());
            dto.setEventoTitulo(evento.getTitulo());
            dto.setEventoFecha(evento.getFecha().toString());
            dto.setEventoHora(evento.getHora().toString());
            dto.setZonaNombre(zona.getNombre());
            dto.setPrecioPagado(zona.getPrecio()); // BigDecimal

            ticketsComprados.add(dto);
        }

        // Retornamos la lista de entradas compradas
        return ticketsComprados;
    }
}