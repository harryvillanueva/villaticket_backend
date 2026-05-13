package com.villaticket_backend.modules.evento.application.dtos;

public class RetiroDTO {
    private Long id;
    private Double monto;
    private String estado;
    private String fechaSolicitud;
    private String vendedorNombre;
    private String vendedorEmail;
    private String iban;

    public RetiroDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getMonto() { return monto; }
    public void setMonto(Double monto) { this.monto = monto; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(String fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
    public String getVendedorNombre() { return vendedorNombre; }
    public void setVendedorNombre(String vendedorNombre) { this.vendedorNombre = vendedorNombre; }
    public String getVendedorEmail() { return vendedorEmail; }
    public void setVendedorEmail(String vendedorEmail) { this.vendedorEmail = vendedorEmail; }
    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }
}