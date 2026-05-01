package com.villaticket_backend.modules.evento.infrastructure.controllers;

import com.villaticket_backend.modules.evento.application.dtos.CategoriaDTO;
import com.villaticket_backend.modules.evento.application.dtos.CrearEventoRequest;
import com.villaticket_backend.modules.evento.application.dtos.EventoDTO;
import com.villaticket_backend.modules.evento.application.use_cases.CrearEvento;
import com.villaticket_backend.modules.evento.application.use_cases.ListarCategorias;
import com.villaticket_backend.modules.evento.application.use_cases.ListarEventos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private CrearEvento crearEvento;

    @Autowired
    private ListarCategorias listarCategorias;

    @Autowired
    private ListarEventos listarEventos;



    @GetMapping
    public ResponseEntity<List<EventoDTO>> getEventosPublicados() {
        return ResponseEntity.ok(listarEventos.publicados());
    }

    @GetMapping("/vendedor/{email}")
    public ResponseEntity<List<EventoDTO>> getEventosPorVendedor(@PathVariable String email) {
        return ResponseEntity.ok(listarEventos.porVendedor(email));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaDTO>> getCategorias() {
        return ResponseEntity.ok(listarCategorias.execute());
    }

    @PostMapping("/crear")
    public ResponseEntity<Map<String, String>> crearEvento(@RequestBody CrearEventoRequest request) {
        try {
            crearEvento.ejecutar(request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Evento creado exitosamente.");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

}