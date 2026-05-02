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

    // Usamos el validador de contraseñas directo en lugar del AuthenticationManager
    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse ejecutar(LoginRequest request) {

        // 1. Buscamos al usuario directamente en la base de datos por su email
        UsuarioEntity usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        // 2. Comparamos la contraseña en texto plano con la encriptada en la base de datos
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales incorrectas");
        }

        // 3. Extraer el rol (por defecto será CLIENTE si ocurre alguna anomalía)
        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "CLIENTE";
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(rolNombre);

        // 4. Crear el objeto UserDetails que la seguridad de Spring requiere
        UserDetails userDetails = new User(
                usuario.getEmail(),
                usuario.getPassword(),
                Collections.singletonList(authority)
        );

        // 5. Crear un Map para guardar información extra dentro del token (como el rol)
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("rol", rolNombre);

        // 6. Generar el token JWT
        String token = jwtService.generateToken(extraClaims, userDetails);

        // 7. Retornar la respuesta
        return new LoginResponse(token, usuario.getEmail(), rolNombre);
    }
}