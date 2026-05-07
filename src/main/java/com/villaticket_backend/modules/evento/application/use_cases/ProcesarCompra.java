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
import java.util.*;

@Service
public class ProcesarCompra {

    @Autowired private JpaUsuarioRepository usuarioRepository;
    @Autowired private JpaEventoRepository eventoRepository;
    @Autowired private JpaZonaRepository zonaRepository;
    @Autowired private JpaTicketRepository ticketRepository;

    // Inyectamos nuestras nuevas herramientas
    @Autowired private GenerarTicketPdf generarTicketPdf;
    @Autowired private EmailService emailService;

    @Transactional
    public List<TicketDTO> ejecutar(CompraRequest request) {

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

        // Un mapa temporal para guardar los PDFs antes de enviarlos
        Map<String, byte[]> pdfsGenerados = new HashMap<>();

        for (CompraRequest.AsistenteDTO asistente : request.getAsistentes()) {
            TicketEntity ticket = new TicketEntity();
            ticket.setCodigoQr(UUID.randomUUID().toString());
            ticket.setFechaCompra(LocalDateTime.now());
            ticket.setEstado("ACTIVO");
            ticket.setEvento(evento);
            ticket.setZona(zona);
            ticket.setUsuario(usuario);
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
            dto.setNombreAsistente(ticketGuardado.getNombreAsistente());
            dto.setDocumentoAsistente(ticketGuardado.getDocumentoAsistente());

            ticketsComprados.add(dto);

            // --- NUEVO: GENERAR EL PDF EN MEMORIA ---
            // Llamamos a nuestra clase generadora pasándole el ID recién creado
            byte[] pdfBytes = generarTicketPdf.ejecutar(ticketGuardado.getId());

            // Creamos un nombre limpio para el archivo PDF
            String nombreArchivo = "Ticket_" + asistente.getNombre().replace(" ", "_") + ".pdf";

            // Lo guardamos en el mapa temporal
            pdfsGenerados.put(nombreArchivo, pdfBytes);
        }

        // --- NUEVO: ENVIAR EL CORREO EN SEGUNDO PLANO ---
        // Lo envolvemos en un hilo nuevo (Thread) para que el servidor responda rápido
        // a la página web, y el envío del correo se procese de fondo sin hacer esperar al usuario.
        new Thread(() -> {
            emailService.enviarCorreoConTickets(usuario.getEmail(), evento.getTitulo(), pdfsGenerados);
        }).start();

        return ticketsComprados;
    }
}