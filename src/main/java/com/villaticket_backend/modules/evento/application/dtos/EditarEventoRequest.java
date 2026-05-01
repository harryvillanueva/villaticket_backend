package com.villaticket_backend.modules.evento.application.dtos;

public class EditarEventoRequest {
    private String titulo;
    private String descripcion;
    private String fecha;
    private String hora;
    private String ubicacion;
    private Long categoriaId;
    private String imagen; // Debe llamarse imagen para mapear con el frontend

    public EditarEventoRequest() {}

    // Getters y Setters
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
}