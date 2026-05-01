package com.villaticket_backend.modules.evento.application.dtos;

import java.util.List;

public class CrearEventoRequest {
    private String titulo;
    private String descripcion;
    private String fecha;
    private String hora;
    private String ubicacion;
    private String imagen; // URL de la imagen principal
    private String vendedorEmail;
    private Long categoriaId;
    private List<String> galeria; // Lista de URLs de la galería

    // Constructor vacío obligatorio para que Spring pueda instanciar la clase
    public CrearEventoRequest() {
    }

    // --- Getters y Setters ---

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public String getVendedorEmail() {
        return vendedorEmail;
    }

    public void setVendedorEmail(String vendedorEmail) {
        this.vendedorEmail = vendedorEmail;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public List<String> getGaleria() {
        return galeria;
    }

    public void setGaleria(List<String> galeria) {
        this.galeria = galeria;
    }
}