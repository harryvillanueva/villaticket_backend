package com.villaticket_backend.shared.infraestructure.security;

import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaRolRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaUsuarioRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.RolEntity;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.CategoriaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaCategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private JpaRolRepository rolRepository;

    @Autowired
    private JpaCategoriaRepository categoriaRepository;

    // --- NUEVAS INYECCIONES PARA CREAR EL USUARIO ---
    @Autowired
    private JpaUsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verificar y crear el rol CLIENTE
        if (rolRepository.findByNombre("CLIENTE").isEmpty()) {
            rolRepository.save(new RolEntity("CLIENTE"));
            System.out.println("Rol CLIENTE creado por defecto.");
        }

        // Verificar y crear el rol VENDEDOR
        if (rolRepository.findByNombre("VENDEDOR").isEmpty()) {
            rolRepository.save(new RolEntity("VENDEDOR"));
            System.out.println("Rol VENDEDOR creado por defecto.");
        }

        // Verificar y crear el rol SUPER_ADMIN
        RolEntity superAdminRol = null;
        if (rolRepository.findByNombre("SUPER_ADMIN").isEmpty()) {
            superAdminRol = rolRepository.save(new RolEntity("SUPER_ADMIN"));
            System.out.println("Rol SUPER_ADMIN creado por defecto.");
        } else {
            superAdminRol = rolRepository.findByNombre("SUPER_ADMIN").get();
        }

        // --- CREAR USUARIO SÚPER ADMIN SI NO EXISTE ---
        String adminEmail = "superadmin@test.com";
        if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
            UsuarioEntity admin = new UsuarioEntity();
            admin.setNombre("Administrador Global");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("welcome1")); // Contraseña por defecto
            admin.setRol(superAdminRol); // Usamos el rol que acabamos de asegurar que existe
            admin.setFechaRegistro(LocalDateTime.now());
            admin.setUrlAvatar("");

            usuarioRepository.save(admin);
            System.out.println(">>> Usuario SÚPER ADMIN creado exitosamente: " + adminEmail);
        }

        // --- INICIALIZAR CATEGORÍAS
        crearCategoriaSiNoExiste("Concierto", "Música en vivo y festivales");
        crearCategoriaSiNoExiste("Teatro", "Obras teatrales y musicales");
        crearCategoriaSiNoExiste("Deportes", "Eventos deportivos y competiciones");
    }

    private void crearCategoriaSiNoExiste(String nombre, String descripcion) {
        if (categoriaRepository.findByNombre(nombre).isEmpty()) {
            categoriaRepository.save(new CategoriaEntity(nombre, descripcion));
            System.out.println("Categoría " + nombre + " creada.");
        }
    }
}