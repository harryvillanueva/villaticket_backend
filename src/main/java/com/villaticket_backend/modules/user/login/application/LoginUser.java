package com.villaticket_backend.modules.user.login.application;

import com.villaticket_backend.config.JwtService;
import com.villaticket_backend.modules.user.infrastructure.persistence.JpaUsuarioRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.UsuarioEntity;
import com.villaticket_backend.modules.user.login.domain.LoginRequest;
import com.villaticket_backend.modules.user.login.domain.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginUser {

    @Autowired
    private JpaUsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public LoginResponse execute(LoginRequest request) {
        // 1. Buscar el usuario por email
        UsuarioEntity usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        // 2. Verificar la contraseña cifrada
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        // 3. Generar el Token JWT usando el nombre del rol
        String token = jwtService.generateToken(usuario.getEmail(), usuario.getRol().getNombre());

        // 4. Retornar la respuesta con el token y el rol
        return new LoginResponse(token, usuario.getEmail(), usuario.getRol().getNombre());
    }
}