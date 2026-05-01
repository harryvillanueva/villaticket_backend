package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.CategoriaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaCategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListarCategorias {

    @Autowired
    private JpaCategoriaRepository categoriaRepository;

    public List<CategoriaEntity> ejecutar() {
        return categoriaRepository.findAll();
    }
}