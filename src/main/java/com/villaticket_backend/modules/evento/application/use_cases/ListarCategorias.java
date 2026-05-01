package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.CategoriaDTO;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaCategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListarCategorias {

    @Autowired
    private JpaCategoriaRepository categoriaRepository;

    public List<CategoriaDTO> execute() {
        return categoriaRepository.findAll().stream()
                .map(cat -> new CategoriaDTO(cat.getId(), cat.getNombre()))
                .collect(Collectors.toList());
    }
}