package com.villaticket_backend.shared.infraestructure.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. Recursos estáticos y frontend
                        .requestMatchers("/", "/*.html", "/css/**", "/js/**", "/uploads/**", "/favicon.ico", "/error").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Rutas Públicas de la API
                        .requestMatchers("/api/auth/**", "/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/eventos/publicados", "/api/eventos/categorias", "/api/eventos/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/zonas/evento/**").permitAll()

                        // 3. Rutas para CUALQUIER usuario logueado (CLIENTE o VENDEDOR)
                        // IMPORTANTE: Ponemos esto ANTES de las reglas específicas de Vendedor
                        .requestMatchers("/api/users/profile/**").authenticated()
                        .requestMatchers("/api/compras/**").authenticated()
                        .requestMatchers("/api/tickets/mis-tickets/**").authenticated()
                        .requestMatchers("/api/upload/**").authenticated() // Permitir subida a todos los logueados

                        // 4. Rutas EXCLUSIVAS de Vendedor
                        .requestMatchers(
                                "/api/eventos/vendedor/**",
                                "/api/eventos/crear",
                                "/api/eventos/{id}/publicar",
                                "/api/eventos/{id}/ocultar",
                                "/api/zonas/**",
                                "/api/tickets/validar/**"
                        ).hasAnyAuthority("VENDEDOR", "ROLE_VENDEDOR")

                        // 5. Cualquier otra petición requiere autenticación
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}