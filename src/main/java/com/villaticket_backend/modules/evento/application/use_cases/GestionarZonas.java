package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.CrearZonaRequest;
import com.villaticket_backend.modules.evento.application.dtos.ZonaDTO;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.EventoEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ZonaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaEventoRepository;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaZonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GestionarZonas {

    @Autowired
    private JpaZonaRepository zonaRepository;

    @Autowired
    private JpaEventoRepository eventoRepository;

    public void agregarZona(Long eventoId, CrearZonaRequest request) {
        EventoEntity evento = eventoRepository.findById(eventoId)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        ZonaEntity zona = new ZonaEntity();
        zona.setNombre(request.getNombre());
        zona.setCapacidadTotal(request.getCapacidad());
        zona.setCapacidadActual(request.getCapacidad()); // Al inicio, la actual es igual a la total
        zona.setPrecio(request.getPrecio());
        zona.setEvento(evento);

        zonaRepository.save(zona);
    }

    public List<ZonaDTO> listarZonasDeEvento(Long eventoId) {
        return zonaRepository.findByEventoId(eventoId).stream()
                .map(z -> new ZonaDTO(
                        z.getId(),
                        z.getNombre(),
                        z.getCapacidadTotal(),
                        z.getCapacidadActual(),
                        z.getPrecio()
                )).collect(Collectors.toList());
    }
}