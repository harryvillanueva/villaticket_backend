package com.villaticket_backend.modules.evento.application.dtos;

import java.util.List;

public class CrearEventoRequest {
    private String titulo;
    private String fecha; // Formato esperado: "YYYY-MM-DD"
    private String hora;  // Formato esperado: "HH:MM"
    private String ubicacion;
    private String imagen;
    private Long categoriaId;
    private String emailVendedor; // Usamos el email para identificar qué vendedor lo crea


    public CrearEventoRequest() {}

    // Getters y Setters
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }
    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
    public String getEmailVendedor() { return emailVendedor; }
    public void setEmailVendedor(String emailVendedor) { this.emailVendedor = emailVendedor; }


}