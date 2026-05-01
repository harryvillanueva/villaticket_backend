package com.villaticket_backend.modules.evento.application.dtos;

import java.math.BigDecimal;

public class CrearZonaRequest {
    private String nombre;
    private Integer capacidad;
    private BigDecimal precio;

    public CrearZonaRequest() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
}