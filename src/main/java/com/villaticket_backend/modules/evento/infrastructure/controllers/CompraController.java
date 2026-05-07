package com.villaticket_backend.modules.evento.infrastructure.controllers;

import com.villaticket_backend.modules.evento.application.dtos.CompraRequest;
import com.villaticket_backend.modules.evento.application.dtos.TicketDTO;
import com.villaticket_backend.modules.evento.application.use_cases.GenerarTicketPdf; // Importar
import com.villaticket_backend.modules.evento.application.use_cases.ProcesarCompra;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    @Autowired private ProcesarCompra procesarCompra;
    @Autowired private JpaTicketRepository ticketRepository;
    @Autowired private GenerarTicketPdf generarTicketPdf; // Inyectar

    @PostMapping("/procesar")
    public ResponseEntity<?> procesar(@RequestBody CompraRequest request) {
        try {
            List<TicketDTO> tickets = procesarCompra.ejecutar(request);
            return ResponseEntity.ok(tickets);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/mis-tickets/{email}")
    public ResponseEntity<List<TicketDTO>> obtenerMisTickets(@PathVariable String email) {
        List<TicketDTO> misTickets = ticketRepository.findByUsuario_Email(email).stream()
                .map(ticket -> {
                    TicketDTO dto = new TicketDTO();
                    dto.setId(ticket.getId());
                    dto.setCodigoQr(ticket.getCodigoQr());
                    dto.setEstado(ticket.getEstado());
                    dto.setEventoTitulo(ticket.getEvento().getTitulo());
                    dto.setEventoFecha(ticket.getEvento().getFecha().toString());
                    dto.setEventoHora(ticket.getEvento().getHora().toString());
                    dto.setZonaNombre(ticket.getZona().getNombre());
                    dto.setPrecioPagado(ticket.getZona().getPrecio());
                    dto.setNombreAsistente(ticket.getNombreAsistente());
                    dto.setDocumentoAsistente(ticket.getDocumentoAsistente());
                    return dto;
                }).collect(Collectors.toList());

        return ResponseEntity.ok(misTickets);
    }

    // --- NUEVO ENDPOINT PARA DESCARGAR EL PDF ---
    @GetMapping("/ticket/{id}/pdf")
    public ResponseEntity<byte[]> descargarPdf(@PathVariable Long id) {
        byte[] pdfBytes = generarTicketPdf.ejecutar(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("Ticket_Villaticket.pdf").build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}