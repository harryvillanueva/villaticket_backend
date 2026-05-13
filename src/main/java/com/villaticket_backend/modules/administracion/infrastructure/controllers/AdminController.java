package com.villaticket_backend.modules.administracion.infrastructure.controllers;

import com.villaticket_backend.modules.evento.application.dtos.EventoDTO;
import com.villaticket_backend.modules.evento.application.dtos.RetiroDTO;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.CategoriaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.RetiroEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.TicketEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaCategoriaRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaRetiroRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private JpaEventoRepository eventoRepository;
    @Autowired private JpaCategoriaRepository categoriaRepository;
    @Autowired private JpaTicketRepository ticketRepository;

    // NUEVO REPOSITORIO
    @Autowired private JpaRetiroRepository retiroRepository;

    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticas() {
        List<TicketEntity> tickets = ticketRepository.findAll();
        double totalRecaudado = 0;
        for (TicketEntity t : tickets) {
            if (t.getZona() != null && t.getZona().getPrecio() != null) {
                totalRecaudado += t.getZona().getPrecio().doubleValue();
            }
        }
        double ganancias = totalRecaudado * 0.10;
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTickets", tickets.size());
        stats.put("totalRecaudado", totalRecaudado);
        stats.put("gananciasPlataforma", ganancias);
        stats.put("totalEventos", eventoRepository.count());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/eventos")
    public ResponseEntity<List<EventoDTO>> listarTodosLosEventos() {
        List<EventoEntity> eventos = eventoRepository.findAll();
        return ResponseEntity.ok(eventos.stream().map(e -> {
            EventoDTO dto = new EventoDTO();
            dto.setId(e.getId());
            dto.setTitulo(e.getTitulo());
            if (e.getFecha() != null) dto.setFecha(e.getFecha().toString());
            dto.setUbicacion(e.getUbicacion());
            dto.setEstado(e.getEstado());
            if (e.getCategoria() != null) dto.setCategoriaNombre(e.getCategoria().getNombre());
            return dto;
        }).collect(Collectors.toList()));
    }

    @PutMapping("/eventos/{id}/cancelar")
    public ResponseEntity<Map<String, String>> cancelarEvento(@PathVariable Long id) {
        EventoEntity evento = eventoRepository.findById(id).orElseThrow();
        evento.setEstado("CANCELADO");
        eventoRepository.save(evento);
        return ResponseEntity.ok(Map.of("message", "Evento cancelado correctamente"));
    }

    @PostMapping("/categorias")
    public ResponseEntity<CategoriaEntity> crearCategoria(@RequestBody Map<String, String> body) {
        CategoriaEntity cat = new CategoriaEntity();
        cat.setNombre(body.get("nombre"));
        return ResponseEntity.ok(categoriaRepository.save(cat));
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<Map<String, String>> eliminarCategoria(@PathVariable Long id) {
        categoriaRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Categoría eliminada"));
    }

    // --- NUEVAS RUTAS DE RETIROS ---
    @GetMapping("/retiros")
    public ResponseEntity<List<RetiroDTO>> listarRetiros() {
        List<RetiroEntity> retiros = retiroRepository.findAll();
        return ResponseEntity.ok(retiros.stream().map(r -> {
            RetiroDTO dto = new RetiroDTO();
            dto.setId(r.getId());
            dto.setMonto(r.getMonto());
            dto.setEstado(r.getEstado());
            if (r.getFechaSolicitud() != null) dto.setFechaSolicitud(r.getFechaSolicitud().toString());
            dto.setVendedorNombre(r.getVendedor().getNombre());
            dto.setVendedorEmail(r.getVendedor().getEmail());
            dto.setIban(r.getVendedor().getIban());
            return dto;
        }).collect(Collectors.toList()));
    }

    @PutMapping("/retiros/{id}/aprobar")
    public ResponseEntity<?> aprobarRetiro(@PathVariable Long id) {
        RetiroEntity retiro = retiroRepository.findById(id).orElseThrow();
        retiro.setEstado("APROBADO");
        retiroRepository.save(retiro);
        return ResponseEntity.ok(Map.of("message", "Retiro aprobado y transferencia completada."));
    }
}