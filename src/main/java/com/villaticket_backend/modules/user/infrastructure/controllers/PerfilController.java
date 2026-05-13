package com.villaticket_backend.modules.user.infrastructure.controllers;

import com.villaticket_backend.modules.user.application.dtos.CambiarPasswordRequest;
import com.villaticket_backend.modules.user.application.dtos.PerfilDTO;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users/profile")
public class PerfilController {

    @Autowired
    private JpaUsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<PerfilDTO> obtenerPerfil() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PerfilDTO dto = new PerfilDTO();
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setRol(usuario.getRol().getNombre());
        dto.setUrlAvatar(usuario.getUrlAvatar());
        dto.setIban(usuario.getIban());

        return ResponseEntity.ok(dto);
    }

    @PutMapping
    public ResponseEntity<Map<String, String>> actualizarPerfil(@RequestBody PerfilDTO request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(request.getNombre());
        usuario.setUrlAvatar(request.getUrlAvatar());

        if (usuario.getRol().getNombre().equalsIgnoreCase("VENDEDOR")) {
            usuario.setIban(request.getIban());
        }

        usuarioRepository.save(usuario);

        // --- CORRECCIÓN: Devolvemos un JSON real ---
        return ResponseEntity.ok(Map.of("message", "Perfil actualizado correctamente"));
    }

    @PutMapping("/password")
    public ResponseEntity<?> cambiarPassword(@RequestBody CambiarPasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UsuarioEntity usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getPasswordActual(), usuario.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña actual es incorrecta"));
        }

        usuario.setPassword(passwordEncoder.encode(request.getPasswordNueva()));
        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("message", "Contraseña cambiada con éxito"));
    }
}