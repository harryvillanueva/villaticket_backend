package com.villaticket_backend.modules.user.infrastructure.persistence.jpa;

import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JpaUsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    boolean existsByEmail(String email);
    Optional<UsuarioEntity> findByEmail(String email); // <-- NUEVO MÉTODO
}