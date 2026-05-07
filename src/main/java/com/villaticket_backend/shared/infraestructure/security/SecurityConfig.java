package com.villaticket_backend.shared.infraestructure.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // --- LA SOLUCIÓN AL 403 ---
                        // Dejamos pasar todas las peticiones OPTIONS que hace el navegador por debajo
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 1. Recursos estáticos y vistas
                        .requestMatchers(
                                "/", "/*.html", "/favicon.ico", "/error", "/css/**", "/js/**", "/img/**", "/assets/**", "/uploads/**"
                        ).permitAll()

                        // 2. Endpoints Públicos
                        .requestMatchers("/api/users/**", "/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/eventos", "/api/eventos/**", "/api/zonas", "/api/zonas/**").permitAll()

                        // 3. Endpoints Protegidos
                        .requestMatchers("/api/compras/**").authenticated()
                        .requestMatchers("/api/upload/**").hasAuthority("VENDEDOR")
                        .requestMatchers("/api/eventos/**").hasAuthority("VENDEDOR")
                        .requestMatchers("/api/zonas/**").hasAuthority("VENDEDOR")
                        .requestMatchers("/api/tickets/**").hasAuthority("VENDEDOR")

                        // 4. Todo lo demás cerrado
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}