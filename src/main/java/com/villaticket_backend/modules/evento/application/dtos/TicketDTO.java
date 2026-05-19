package com.villaticket_backend.modules.evento.application.dtos;

import java.math.BigDecimal;

public class TicketDTO {
    private Long id;
    private String codigoQr;
    private String estado;
    private String eventoTitulo;
    private String eventoFecha;
    private String eventoHora;
    private String zonaNombre;
    private BigDecimal precioPagado;
    private String nombreAsistente;
    private String documentoAsistente;

    public TicketDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigoQr() { return codigoQr; }
    public void setCodigoQr(String codigoQr) { this.codigoQr = codigoQr; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getEventoTitulo() { return eventoTitulo; }
    public void setEventoTitulo(String eventoTitulo) { this.eventoTitulo = eventoTitulo; }
    public String getEventoFecha() { return eventoFecha; }
    public void setEventoFecha(String eventoFecha) { this.eventoFecha = eventoFecha; }
    public String getEventoHora() { return eventoHora; }
    public void setEventoHora(String eventoHora) { this.eventoHora = eventoHora; }
    public String getZonaNombre() { return zonaNombre; }
    public void setZonaNombre(String zonaNombre) { this.zonaNombre = zonaNombre; }
    public BigDecimal getPrecioPagado() { return precioPagado; }
    public void setPrecioPagado(BigDecimal precioPagado) { this.precioPagado = precioPagado; }

    public String getNombreAsistente() { return nombreAsistente; }
    public void setNombreAsistente(String nombreAsistente) { this.nombreAsistente = nombreAsistente; }
    public String getDocumentoAsistente() { return documentoAsistente; }
    public void setDocumentoAsistente(String documentoAsistente) { this.documentoAsistente = documentoAsistente; }
}