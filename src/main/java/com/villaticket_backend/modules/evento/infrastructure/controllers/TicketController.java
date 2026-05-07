package com.villaticket_backend.modules.evento.infrastructure.controllers;

import com.villaticket_backend.modules.evento.application.use_cases.ValidarTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private ValidarTicket validarTicket;

    @GetMapping("/validar/{qr}")
    public ResponseEntity<Map<String, Object>> validar(@PathVariable String qr) {
        Map<String, Object> resultado = validarTicket.ejecutar(qr);
        return ResponseEntity.ok(resultado);
    }
}