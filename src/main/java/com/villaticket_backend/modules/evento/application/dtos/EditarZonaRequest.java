package com.villaticket_backend.modules.evento.application.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class EditarZonaRequest {

    @NotBlank(message = "El nombre de la zona es obligatorio.")
    private String nombre;


    private Integer capacidad;

    @NotNull(message = "El precio es obligatorio.")
    @Min(value = 0, message = "El precio no puede ser negativo.")
    private BigDecimal precio;

    @NotNull(message = "La capacidad total es obligatoria.")
    @Min(value = 1, message = "La capacidad total debe ser al menos 1.")
    private Integer capacidadTotal;

    public EditarZonaRequest() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public Integer getCapacidadTotal() { return capacidadTotal; }
    public void setCapacidadTotal(Integer capacidadTotal) { this.capacidadTotal = capacidadTotal; }
}