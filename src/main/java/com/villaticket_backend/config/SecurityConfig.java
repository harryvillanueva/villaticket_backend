package com.villaticket_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Desactivar CSRF (Crucial cuando usamos JWT y APIs REST)
                .csrf(csrf -> csrf.disable())

                // 2. Configurar qué rutas son públicas y cuáles privadas
                .authorizeHttpRequests(auth -> auth
                        // -- ARCHIVOS FRONTEND (Públicos) --
                        .requestMatchers(
                                "/",
                                "/*.html",
                                "/css/**",
                                "/js/**",
                                "/img/**",
                                "/assets/**"
                        ).permitAll()

                        // -- ENDPOINTS DE API (Públicos) --
                        // IMPORTANTE: Asegúrate de que esta ruta coincida con el @RequestMapping de tu RegisterUserController
                        .requestMatchers("/api/v1/users/register", "/api/v1/auth/login").permitAll()

                        // -- TODO LO DEMÁS -- (Requiere estar logueado con Token)
                        .anyRequest().authenticated()
                )

                // 3. Decirle a Spring que no use sesiones tradicionales (Cookies), porque usaremos JWT (Stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    // Bean para encriptar contraseñas (Lo usamos en el RegisterUser.java)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}