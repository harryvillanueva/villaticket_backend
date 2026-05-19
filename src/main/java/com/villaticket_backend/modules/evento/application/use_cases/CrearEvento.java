package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.CrearEventoRequest;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.CategoriaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ImagenEventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaCategoriaRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaImagenEventoRepository;
import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import com.villaticket_backend.modules.user.infrastructure.persistence.jpa.JpaUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class CrearEvento {

    @Autowired
    private JpaEventoRepository eventoRepository;

    @Autowired
    private JpaCategoriaRepository categoriaRepository;

    @Autowired
    private JpaUsuarioRepository usuarioRepository;

    @Autowired
    private JpaImagenEventoRepository imagenEventoRepository;

    @Transactional // Garantiza que si algo falla, no se guarde nada a medias
    public EventoEntity ejecutar(CrearEventoRequest request) {
        UsuarioEntity vendedor = usuarioRepository.findByEmail(request.getVendedorEmail())
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        CategoriaEntity categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));


        EventoEntity evento = new EventoEntity();
        evento.setTitulo(request.getTitulo());
        evento.setDescripcion(request.getDescripcion());
        evento.setFecha(LocalDate.parse(request.getFecha()));
        evento.setHora(LocalTime.parse(request.getHora()));
        evento.setUbicacion(request.getUbicacion());
        evento.setImagen(request.getImagen());
        evento.setEstado("BORRADOR");
        evento.setVendedor(vendedor);
        evento.setCategoria(categoria);


        EventoEntity eventoGuardado = eventoRepository.save(evento);


        if (request.getGaleria() != null && !request.getGaleria().isEmpty()) {
            int orden = 1;
            for (String urlImagen : request.getGaleria()) {
                ImagenEventoEntity imgEntity = new ImagenEventoEntity();
                imgEntity.setUrlImagen(urlImagen);
                imgEntity.setOrden(orden++);
                imgEntity.setEvento(eventoGuardado);
                imagenEventoRepository.save(imgEntity);
            }
        }

        return eventoGuardado;
    }
}