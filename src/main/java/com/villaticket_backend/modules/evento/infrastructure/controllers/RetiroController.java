package com.villaticket_backend.modules.evento.infrastructure.controllers;

import com.villaticket_backend.modules.evento.application.dtos.RetiroDTO;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.RetiroEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ZonaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaRetiroRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaZonaRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/eventos/vendedor/finanzas")
public class RetiroController {

    @Autowired private JpaUsuarioRepository usuarioRepository;
    @Autowired private JpaEventoRepository eventoRepository;
    @Autowired private JpaZonaRepository zonaRepository;
    @Autowired private JpaRetiroRepository retiroRepository;

    @GetMapping("/saldo")
    public ResponseEntity<Map<String, Object>> obtenerSaldo() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioEntity vendedor = usuarioRepository.findByEmail(email).orElseThrow();

        double ingresosTotales = 0.0;
        List<EventoEntity> eventos = eventoRepository.findByVendedor_Email(email);
        for (EventoEntity ev : eventos) {
            List<ZonaEntity> zonas = zonaRepository.findByEventoId(ev.getId());
            for (ZonaEntity zona : zonas) {
                int capacidad = zona.getCapacidadTotal() != null ? zona.getCapacidadTotal() : 0;
                int disponible = zona.getCapacidadActual() != null ? zona.getCapacidadActual() : capacidad;
                int vendidos = capacidad - disponible;
                if (zona.getPrecio() != null) {
                    ingresosTotales += (vendidos * zona.getPrecio().doubleValue());
                }
            }
        }

        double saldoNeto = ingresosTotales * 0.90;

        List<RetiroEntity> retiros = retiroRepository.findByVendedor(vendedor);
        double retirado = 0.0;
        for (RetiroEntity r : retiros) {
            if (!"RECHAZADO".equals(r.getEstado())) {
                retirado += r.getMonto();
            }
        }

        double saldoDisponible = saldoNeto - retirado;

        return ResponseEntity.ok(Map.of(
                "ingresosBrutos", ingresosTotales,
                "saldoNeto", saldoNeto,
                "retirado", retirado,
                "saldoDisponible", saldoDisponible,
                "iban", vendedor.getIban() != null ? vendedor.getIban() : ""
        ));
    }

    @PostMapping("/solicitar")
    public ResponseEntity<?> solicitarRetiro(@RequestBody Map<String, Double> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioEntity vendedor = usuarioRepository.findByEmail(email).orElseThrow();

        if (vendedor.getIban() == null || vendedor.getIban().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Debes configurar tu IBAN en 'Mi Perfil' para retirar fondos."));
        }

        Double monto = body.get("monto");
        if (monto == null || monto <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Monto inválido."));
        }

        RetiroEntity retiro = new RetiroEntity();
        retiro.setMonto(monto);
        retiro.setEstado("PENDIENTE");
        retiro.setFechaSolicitud(LocalDateTime.now());
        retiro.setVendedor(vendedor);
        retiroRepository.save(retiro);

        return ResponseEntity.ok(Map.of("message", "Solicitud de retiro enviada con éxito."));
    }

    @GetMapping("/historial")
    public ResponseEntity<List<RetiroDTO>> historialRetiros() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioEntity vendedor = usuarioRepository.findByEmail(email).orElseThrow();

        List<RetiroEntity> retiros = retiroRepository.findByVendedor(vendedor);
        return ResponseEntity.ok(retiros.stream().map(r -> {
            RetiroDTO dto = new RetiroDTO();
            dto.setId(r.getId());
            dto.setMonto(r.getMonto());
            dto.setEstado(r.getEstado());
            if (r.getFechaSolicitud() != null) dto.setFechaSolicitud(r.getFechaSolicitud().toString());
            return dto;
        }).collect(Collectors.toList()));
    }
}