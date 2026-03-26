package com.villaticket_backend.modules.user.infrastructure.persistence;

import com.villaticket_backend.modules.user.domain.model.Usuario;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    // De Dominio a Entidad (para guardar)
    public UsuarioEntity toEntity(Usuario domain) {
        if (domain == null) return null;

        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(domain.getId());
        entity.setEmail(domain.getEmail());
        entity.setPassword(domain.getPassword());
        entity.setNombre(domain.getNombre());
        entity.setRol(domain.getRol());
        entity.setIban(domain.getIban());
        entity.setUrlAvatar(domain.getUrlAvatar());
        entity.setFechaRegistro(domain.getFechaRegistro());
        return entity;
    }

    // De Entidad a Dominio (para devolver)
    public Usuario toDomain(UsuarioEntity entity) {
        if (entity == null) return null;

        return new Usuario(
                entity.getId(),
                entity.getEmail(),
                entity.getPassword(),
                entity.getNombre(),
                entity.getRol(),
                entity.getIban(),
                entity.getUrlAvatar(),
                entity.getFechaRegistro()
        );
    }
}