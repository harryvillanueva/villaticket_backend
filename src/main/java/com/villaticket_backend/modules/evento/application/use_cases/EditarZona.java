package com.villaticket_backend.modules.evento.application.use_cases;

import com.villaticket_backend.modules.evento.application.dtos.EditarZonaRequest;
import com.villaticket_backend.modules.evento.infrastructure.persistence.entities.ZonaEntity;
import com.villaticket_backend.modules.evento.infrastructure.persistence.jpa.JpaZonaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EditarZona {

    @Autowired
    private JpaZonaRepository zonaRepository;

    @Transactional
    public ZonaEntity ejecutar(Long id, EditarZonaRequest request) {
        ZonaEntity zona = zonaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Zona no encontrada"));


        int diferencia = request.getCapacidadTotal() - zona.getCapacidadTotal();

        zona.setNombre(request.getNombre());
        zona.setCapacidadTotal(request.getCapacidadTotal());
        zona.setPrecio(request.getPrecio());
        zona.setCapacidadActual(zona.getCapacidadActual() + diferencia);

        return zonaRepository.save(zona);
    }
}