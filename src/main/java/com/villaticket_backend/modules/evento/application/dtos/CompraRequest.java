package com.villaticket_backend.modules.evento.application.dtos;

public class CompraRequest {
    private Long eventoId;
    private Long zonaId;
    private Integer cantidad;
    private String usuarioEmail; // Para saber a quién asignarle los tickets

    public CompraRequest() {}

    public Long getEventoId() { return eventoId; }
    public void setEventoId(Long eventoId) { this.eventoId = eventoId; }
    public Long getZonaId() { return zonaId; }
    public void setZonaId(Long zonaId) { this.zonaId = zonaId; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public String getUsuarioEmail() { return usuarioEmail; }
    public void setUsuarioEmail(String usuarioEmail) { this.usuarioEmail = usuarioEmail; }
}