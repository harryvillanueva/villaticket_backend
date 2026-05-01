package com.villaticket_backend.shared.infraestructure.security;

import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaRolRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.RolEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.CategoriaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaCategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private JpaRolRepository rolRepository;

    @Autowired
    private JpaCategoriaRepository categoriaRepository;

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
        if (rolRepository.findByNombre("SUPER_ADMIN").isEmpty()) {
            rolRepository.save(new RolEntity("SUPER_ADMIN"));
            System.out.println("Rol SUPER_ADMIN creado por defecto.");
        }
        // --- INICIALIZAR CATEGORÍAS ---
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