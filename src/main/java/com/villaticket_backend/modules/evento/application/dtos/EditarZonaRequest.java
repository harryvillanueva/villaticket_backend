package com.villaticket_backend.modules.evento.application.dtos;

import java.math.BigDecimal;

public class EditarZonaRequest {
    private String nombre;
    private Integer capacidadTotal;
    private BigDecimal precio;

    public EditarZonaRequest() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getCapacidadTotal() { return capacidadTotal; }
    public void setCapacidadTotal(Integer capacidadTotal) { this.capacidadTotal = capacidadTotal; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
}