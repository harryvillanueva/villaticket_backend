package com.villaticket_backend.modules.evento.application.dtos;

import java.util.List;

public class CompraRequest {
    private Long eventoId;
    private Long zonaId;
    private String usuarioEmail;

    private List<AsistenteDTO> asistentes;

    public CompraRequest() {}

    public Long getEventoId() { return eventoId; }
    public void setEventoId(Long eventoId) { this.eventoId = eventoId; }
    public Long getZonaId() { return zonaId; }
    public void setZonaId(Long zonaId) { this.zonaId = zonaId; }
    public String getUsuarioEmail() { return usuarioEmail; }
    public void setUsuarioEmail(String usuarioEmail) { this.usuarioEmail = usuarioEmail; }
    public List<AsistenteDTO> getAsistentes() { return asistentes; }
    public void setAsistentes(List<AsistenteDTO> asistentes) { this.asistentes = asistentes; }


    public static class AsistenteDTO {
        private String nombre;
        private String documento;

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getDocumento() { return documento; }
        public void setDocumento(String documento) { this.documento = documento; }
    }
}