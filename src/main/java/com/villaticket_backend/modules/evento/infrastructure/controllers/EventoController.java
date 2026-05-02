package com.villaticket_backend.modules.evento.infrastructure.controllers;

import com.villaticket_backend.modules.evento.application.dtos.CrearEventoRequest;
import com.villaticket_backend.modules.evento.application.dtos.EditarEventoRequest;
import com.villaticket_backend.modules.evento.application.dtos.EventoDTO;
import com.villaticket_backend.modules.evento.application.use_cases.*;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.CategoriaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    @Autowired
    private CrearEvento crearEvento;

    @Autowired
    private ListarEventos listarEventos;

    @Autowired
    private ObtenerEvento obtenerEvento;

    @Autowired
    private PublicarEvento publicarEvento;

    @Autowired
    private ListarCategorias listarCategorias; // Inyectamos el caso de uso
    @Autowired private EditarEvento editarEvento; // NUEVO

    // Endpoint: Carga la cartelera pública
    @GetMapping
    public ResponseEntity<List<EventoDTO>> listarTodosPublicados() {
        List<EventoDTO> eventos = listarEventos.ejecutarPublicos();
        return ResponseEntity.ok(eventos);
    }

    // NUEVO ENDPOINT: Listar categorías para el formulario
    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaEntity>> listarCategorias() {
        List<CategoriaEntity> categorias = listarCategorias.ejecutar();
        return ResponseEntity.ok(categorias);
    }

    // Crear Evento
    @PostMapping("/crear")
    public ResponseEntity<EventoEntity> crearEvento(@RequestBody CrearEventoRequest request) {
        EventoEntity nuevoEvento = crearEvento.ejecutar(request);
        return ResponseEntity.ok(nuevoEvento);
    }

    // Listar eventos del vendedor
    @GetMapping("/vendedor/{email}")
    public ResponseEntity<List<EventoDTO>> listarPorVendedor(@PathVariable String email) {
        List<EventoDTO> eventos = listarEventos.ejecutarPorVendedor(email);
        return ResponseEntity.ok(eventos);
    }

    // Ver detalles de un evento
    @GetMapping("/{id}")
    public ResponseEntity<EventoDTO> obtenerPorId(@PathVariable Long id) {
        EventoDTO evento = obtenerEvento.ejecutar(id);
        return ResponseEntity.ok(evento);
    }

    // Publicar Evento
    @PutMapping("/{id}/publicar")
    public ResponseEntity<EventoEntity> publicar(@PathVariable Long id) {
        EventoEntity eventoPublicado = publicarEvento.ejecutar(id);
        return ResponseEntity.ok(eventoPublicado);
    }
    @PutMapping("/{id}")
    public ResponseEntity<EventoDTO> editar(@PathVariable Long id, @RequestBody EditarEventoRequest request) {
        // Ahora devuelve EventoDTO, Jackson no tendrá problemas con Hibernate
        return ResponseEntity.ok(editarEvento.ejecutar(id, request));
    }
}