package com.villaticket_backend.modules.evento.application.dtos;

import java.math.BigDecimal;

public class CrearZonaRequest {
    private Long eventoId; // NUEVO: Campo necesario para el controlador
    private String nombre;
    private Integer capacidad;
    private BigDecimal precio;
    private Integer capacidadTotal;
    private Integer capacidadActual;

    public CrearZonaRequest() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public Integer getCapacidadTotal() {
        return capacidadTotal;
    }

    public void setCapacidadTotal(Integer capacidadTotal) {
        this.capacidadTotal = capacidadTotal;
    }

    public Integer getCapacidadActual() {
        return capacidadActual;
    }

    public void setCapacidadActual(Integer capacidadActual) {
        this.capacidadActual = capacidadActual;
    }
    public Long getEventoId() { return eventoId; }
    public void setEventoId(Long eventoId) { this.eventoId = eventoId; }
}