package com.villaticket_backend.modules.evento.application.dtos;

import java.math.BigDecimal;

public class ZonaDTO {
    private Long id;
    private String nombre;
    private Integer capacidadTotal;
    private Integer capacidadActual;
    private BigDecimal precio;

    public ZonaDTO(Long id, String nombre, Integer capacidadTotal, Integer capacidadActual, BigDecimal precio) {
        this.id = id;
        this.nombre = nombre;
        this.capacidadTotal = capacidadTotal;
        this.capacidadActual = capacidadActual;
        this.precio = precio;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public Integer getCapacidadTotal() { return capacidadTotal; }
    public Integer getCapacidadActual() { return capacidadActual; }
    public BigDecimal getPrecio() { return precio; }
}