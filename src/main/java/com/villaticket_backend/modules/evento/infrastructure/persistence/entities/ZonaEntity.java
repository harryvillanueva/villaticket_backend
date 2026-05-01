package com.villaticket_backend.modules.evento.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "zonas")
public class ZonaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "capacidad_total", nullable = false)
    private Integer capacidadTotal;

    @Column(name = "capacidad_actual", nullable = false)
    private Integer capacidadActual;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    // Relación con Evento
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private EventoEntity evento;

    public ZonaEntity() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Integer getCapacidadTotal() { return capacidadTotal; }
    public void setCapacidadTotal(Integer capacidadTotal) { this.capacidadTotal = capacidadTotal; }
    public Integer getCapacidadActual() { return capacidadActual; }
    public void setCapacidadActual(Integer capacidadActual) { this.capacidadActual = capacidadActual; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public EventoEntity getEvento() { return evento; }
    public void setEvento(EventoEntity evento) { this.evento = evento; }
}