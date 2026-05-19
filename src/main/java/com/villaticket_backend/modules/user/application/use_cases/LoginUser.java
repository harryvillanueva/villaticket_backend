package com.villaticket_backend.modules.user.application.use_cases;

import com.villaticket_backend.modules.user.application.dtos.LoginRequest;
import com.villaticket_backend.modules.user.application.dtos.LoginResponse;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaUsuarioRepository;
import com.villaticket_backend.shared.infraestructure.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class LoginUser {

    @Autowired
    private JpaUsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse ejecutar(LoginRequest request) {

        UsuarioEntity usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        // Verificar si el usuario está bloqueado
        if (usuario.getActivo() != null && !usuario.getActivo()) {
            throw new RuntimeException("Tu cuenta ha sido bloqueada por un administrador.");
        }

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "CLIENTE";
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(rolNombre);

        UserDetails userDetails = new User(
                usuario.getEmail(),
                usuario.getPassword(),
                Collections.singletonList(authority)
        );

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("rol", rolNombre);

        String token = jwtService.generateToken(extraClaims, userDetails);

        return new LoginResponse(token, usuario.getEmail(), rolNombre);
    }
}