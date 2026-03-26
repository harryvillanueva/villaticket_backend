package com.villaticket_backend.modules.user.domain.repository;

import com.villaticket_backend.modules.user.domain.model.Usuario;

public interface IUsuarioRepository {
    Usuario save(Usuario usuario);
    boolean existsByEmail(String email);
}
