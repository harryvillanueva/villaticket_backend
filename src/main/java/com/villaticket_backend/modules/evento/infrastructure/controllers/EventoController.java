package com.villaticket_backend.modules.evento.infrastructure.controllers;

import com.villaticket_backend.modules.evento.application.dtos.CrearEventoRequest;
import com.villaticket_backend.modules.evento.application.dtos.EditarEventoRequest;
import com.villaticket_backend.modules.evento.application.dtos.EventoDTO;
import com.villaticket_backend.modules.evento.application.use_cases.*;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.CategoriaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired private CrearEvento crearEvento;
    @Autowired private ListarEventos listarEventos;
    @Autowired private ObtenerEvento obtenerEvento;
    @Autowired private PublicarEvento publicarEvento;
    @Autowired private ListarCategorias listarCategorias;
    @Autowired private EditarEvento editarEvento;
    @Autowired private OcultarEvento ocultarEvento;


    @GetMapping("/publicados")
    public ResponseEntity<Page<EventoDTO>> listarTodosPublicados(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<EventoDTO> eventosPaginados = listarEventos.ejecutarPublicosPaginado(page, size);
        return ResponseEntity.ok(eventosPaginados);
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaEntity>> listarCategorias() {
        return ResponseEntity.ok(listarCategorias.ejecutar());
    }

    @PostMapping("/crear")
    public ResponseEntity<EventoEntity> crearEvento(@RequestBody CrearEventoRequest request) {
        return ResponseEntity.ok(crearEvento.ejecutar(request));
    }

    @GetMapping("/vendedor/{email}")
    public ResponseEntity<List<EventoDTO>> listarPorVendedor(@PathVariable String email) {
        return ResponseEntity.ok(listarEventos.ejecutarPorVendedor(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(obtenerEvento.ejecutar(id));
    }

    @PutMapping("/{id}/publicar")
    public ResponseEntity<Map<String, String>> publicar(@PathVariable Long id) {
        publicarEvento.ejecutar(id);
        return ResponseEntity.ok(Map.of("message", "Evento publicado exitosamente"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoDTO> editar(@PathVariable Long id, @RequestBody EditarEventoRequest request) {
        return ResponseEntity.ok(editarEvento.ejecutar(id, request));
    }

    @PutMapping("/{id}/ocultar")
    public ResponseEntity<Map<String, String>> ocultar(@PathVariable Long id) {
        ocultarEvento.ejecutar(id);
        return ResponseEntity.ok(Map.of("message", "Evento ocultado exitosamente"));
    }
}