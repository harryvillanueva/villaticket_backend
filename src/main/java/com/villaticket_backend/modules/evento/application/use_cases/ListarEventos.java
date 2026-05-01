package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.EventoDTO;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListarEventos {

    @Autowired
    private JpaEventoRepository eventoRepository;

    @Autowired
    private JpaUsuarioRepository usuarioRepository;

    // Listar todos los eventos publicados para la cartelera
    public List<EventoDTO> publicados() {
        return eventoRepository.findByEstado("PUBLICADO").stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Listar solo los eventos de un vendedor específico por su email
    public List<EventoDTO> porVendedor(String email) {
        UsuarioEntity vendedor = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        return eventoRepository.findByVendedorId(vendedor.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EventoDTO mapToDTO(EventoEntity entity) {
        return new EventoDTO(
                entity.getId(),
                entity.getTitulo(),
                entity.getFecha(),
                entity.getHora(),
                entity.getUbicacion(),
                entity.getImagen(),
                entity.getCategoria().getNombre(),
                entity.getEstado()
        );
    }
}