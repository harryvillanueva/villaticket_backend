package com.villaticket_backend.config;

import com.villaticket_backend.modules.user.infrastructure.persistence.JpaRolRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.RolEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private JpaRolRepository rolRepository;

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
    }
}