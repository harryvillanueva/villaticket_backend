package com.villaticket_backend.modules.evento.infrastructure.persistence.jpa;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.RetiroEntity;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JpaRetiroRepository extends JpaRepository<RetiroEntity, Long> {
    List<RetiroEntity> findByVendedor(UsuarioEntity vendedor);
}