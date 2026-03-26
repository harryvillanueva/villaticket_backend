package com.villaticket_backend.modules.user.infrastructure.adapter;

import com.villaticket_backend.modules.user.domain.model.Usuario;
import com.villaticket_backend.modules.user.domain.repository.IUsuarioRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.JpaUsuarioRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.UsuarioEntity;
import com.villaticket_backend.modules.user.infrastructure.persistence.UsuarioMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class MySQLUsuarioRepository implements IUsuarioRepository {

    @Autowired
    private JpaUsuarioRepository jpaRepository;

    @Autowired
    private UsuarioMapper mapper;

    @Override
    public Usuario save(Usuario usuario) {
        UsuarioEntity entity = mapper.toEntity(usuario);
        UsuarioEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }
}