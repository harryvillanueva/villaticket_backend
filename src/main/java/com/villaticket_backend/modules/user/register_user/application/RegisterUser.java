package com.villaticket_backend.modules.user.register_user.application;


import com.villaticket_backend.modules.user.domain.model.Usuario;
import com.villaticket_backend.modules.user.domain.repository.IUsuarioRepository;
import com.villaticket_backend.modules.user.register_user.domain.RegisterUserRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


@Service

public class RegisterUser {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario run(RegisterUserRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(request.getEmail());
        String passwordEncriptada = passwordEncoder.encode(request.getPassword());
        usuario.setPassword(passwordEncriptada);
        usuario.setNombre(request.getNombre());
        usuario.setRol(request.getRol());
        usuario.setFechaRegistro(LocalDateTime.now());

        return usuarioRepository.save(usuario);
    }
}
