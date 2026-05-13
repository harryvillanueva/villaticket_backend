package com.villaticket_backend.modules.evento.infrastructure.persistence.entities;

import com.villaticket_backend.modules.user.infrastructure.persistence.entities.UsuarioEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "retiros")
public class RetiroEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false)
    private String estado; // PENDIENTE, APROBADO, RECHAZADO

    private LocalDateTime fechaSolicitud;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendedor_id", nullable = false)
    private UsuarioEntity vendedor;

    public RetiroEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
    public UsuarioEntity getVendedor() { return vendedor; }
    public void setVendedor(UsuarioEntity vendedor) { this.vendedor = vendedor; }
}