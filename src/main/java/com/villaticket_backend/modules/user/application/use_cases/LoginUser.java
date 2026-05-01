package com.villaticket_backend.modules.user.application.use_cases;

import com.villaticket_backend.shared.infraestructure.security.JwtService;
import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaUsuarioRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import com.villaticket_backend.modules.user.application.dtos.LoginRequest;
import com.villaticket_backend.modules.user.application.dtos.LoginResponse;
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