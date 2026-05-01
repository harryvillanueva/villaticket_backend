package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.CrearZonaRequest;
import com.villaticket_backend.modules.evento.application.dtos.EditarZonaRequest;
import com.villaticket_backend.modules.evento.application.dtos.ZonaDTO;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ZonaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaZonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GestionarZonas {

    @Autowired
    private JpaZonaRepository zonaRepository;

    @Autowired
    private JpaEventoRepository eventoRepository;

    @Transactional
    public void agregarZona(Long eventoId, CrearZonaRequest request) {
        EventoEntity evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        ZonaEntity zona = new ZonaEntity();
        zona.setNombre(request.getNombre());
        zona.setCapacidadTotal(request.getCapacidadTotal());
        zona.setCapacidadActual(request.getCapacidadTotal());
        zona.setPrecio(request.getPrecio()); // request.getPrecio() ya es BigDecimal
        zona.setEvento(evento);

        zonaRepository.save(zona);
    }

    @Transactional
    public void editarZona(Long zonaId, EditarZonaRequest request) {
        ZonaEntity zona = zonaRepository.findById(zonaId)
                .orElseThrow(() -> new RuntimeException("Zona no encontrada"));

        int diferencia = request.getCapacidadTotal() - zona.getCapacidadTotal();

        zona.setNombre(request.getNombre());
        zona.setCapacidadTotal(request.getCapacidadTotal());
        zona.setPrecio(request.getPrecio()); // request.getPrecio() ya es BigDecimal
        zona.setCapacidadActual(zona.getCapacidadActual() + diferencia);

        zonaRepository.save(zona);
    }

    public List<ZonaDTO> listarZonasDeEvento(Long eventoId) {
        return zonaRepository.findAll().stream()
                .filter(z -> z.getEvento().getId().equals(eventoId))
                .map(z -> new ZonaDTO(
                        z.getId(),
                        z.getNombre(),
                        z.getCapacidadTotal(),
                        z.getCapacidadActual(),
                        z.getPrecio() // Sin conversiones, ambos son BigDecimal
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void eliminarZona(Long id) {
        if (zonaRepository.existsById(id)) {
            zonaRepository.deleteById(id);
        } else {
            throw new RuntimeException("La zona no existe");
        }
    }
}