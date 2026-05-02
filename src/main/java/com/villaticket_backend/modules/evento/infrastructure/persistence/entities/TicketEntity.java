package com.villaticket_backend.modules.evento.infrastructure.persistence.entities;

import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class TicketEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigoQr; // El texto único que JavaScript convertirá en imagen QR

    @Column(nullable = false)
    private LocalDateTime fechaCompra;

    @Column(nullable = false)
    private String estado; // ACTIVO, USADO, CANCELADO

    @ManyToOne
    @JoinColumn(name = "evento_id", nullable = false)
    private EventoEntity evento;

    @ManyToOne
    @JoinColumn(name = "zona_id", nullable = false)
    private ZonaEntity zona;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;

    public TicketEntity() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigoQr() { return codigoQr; }
    public void setCodigoQr(String codigoQr) { this.codigoQr = codigoQr; }
    public LocalDateTime getFechaCompra() { return fechaCompra; }
    public void setFechaCompra(LocalDateTime fechaCompra) { this.fechaCompra = fechaCompra; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public EventoEntity getEvento() { return evento; }
    public void setEvento(EventoEntity evento) { this.evento = evento; }
    public ZonaEntity getZona() { return zona; }
    public void setZona(ZonaEntity zona) { this.zona = zona; }
    public UsuarioEntity getUsuario() { return usuario; }
    public void setUsuario(UsuarioEntity usuario) { this.usuario = usuario; }
}