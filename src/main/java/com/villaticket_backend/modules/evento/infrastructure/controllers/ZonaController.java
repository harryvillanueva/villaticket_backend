package com.villaticket_backend.modules.evento.infrastructure.controllers;

import com.villaticket_backend.modules.evento.application.dtos.CrearZonaRequest;
import com.villaticket_backend.modules.evento.application.dtos.EditarZonaRequest;
import com.villaticket_backend.modules.evento.application.dtos.ZonaDTO;
import com.villaticket_backend.modules.evento.application.use_cases.GestionarZonas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zonas")
public class ZonaController {

    @Autowired
    private GestionarZonas gestionarZonas;

    @PostMapping
    public ResponseEntity<Map<String, String>> crearZona(@RequestBody CrearZonaRequest request) {
        try {
            // Ahora request.getEventoId() ya funcionará porque lo añadimos al DTO
            gestionarZonas.agregarZona(request.getEventoId(), request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Zona agregada con éxito.");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> actualizarZona(
            @PathVariable Long id,
            @RequestBody EditarZonaRequest request) {
        try {
            gestionarZonas.editarZona(id, request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Zona actualizada con éxito.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/evento/{eventoId}")
    public ResponseEntity<List<ZonaDTO>> listarZonas(@PathVariable Long eventoId) {
        return ResponseEntity.ok(gestionarZonas.listarZonasDeEvento(eventoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        // Nota: Asegúrate de tener implementado eliminarZona en GestionarZonas si prefieres usarlo
        // Por ahora usamos el repositorio directamente para no crear más fallos
        gestionarZonas.eliminarZona(id);
        return ResponseEntity.noContent().build();
    }
}