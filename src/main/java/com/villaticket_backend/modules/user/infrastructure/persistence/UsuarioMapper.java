package com.villaticket_backend.modules.user.infrastructure.persistence;

import com.villaticket_backend.modules.user.domain.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UsuarioMapper {

    @Autowired
    private JpaRolRepository rolRepository; // Necesitamos esto para buscar el rol real

    // De Dominio a Entidad (para guardar)
    public UsuarioEntity toEntity(Usuario domain) {
        if (domain == null) return null;

        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(domain.getId());
        entity.setEmail(domain.getEmail());
        entity.setPassword(domain.getPassword());
        entity.setNombre(domain.getNombre());
        entity.setIban(domain.getIban());
        entity.setUrlAvatar(domain.getUrlAvatar());
        entity.setFechaRegistro(domain.getFechaRegistro());

        // Magia del Mapper: Buscar el rol por nombre y asignarlo a la entidad
        if (domain.getRolNombre() != null) {
            RolEntity rolEntity = rolRepository.findByNombre(domain.getRolNombre())
                    .orElseThrow(() -> new RuntimeException("Error: El rol " + domain.getRolNombre() + " no existe en la BD"));
            entity.setRol(rolEntity);
        }

        return entity;
    }

    // De Entidad a Dominio (para devolver al controlador)
    public Usuario toDomain(UsuarioEntity entity) {
        if (entity == null) return null;

        Usuario domain = new Usuario();
        domain.setId(entity.getId());
        domain.setEmail(entity.getEmail());
        domain.setPassword(entity.getPassword());
        domain.setNombre(entity.getNombre());
        domain.setIban(entity.getIban());
        domain.setUrlAvatar(entity.getUrlAvatar());
        domain.setFechaRegistro(entity.getFechaRegistro());

        if (entity.getRol() != null) {
            domain.setRolNombre(entity.getRol().getNombre());
        }

        return domain;
    }
}