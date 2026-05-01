package com.villaticket_backend.modules.evento.application.dtos;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class EventoDTO {
    private Long id;
    private String titulo;
    private LocalDate fecha;
    private LocalTime hora;
    private String ubicacion;
    private String imagen;
    private String nombreCategoria;
    private String estado;


    public EventoDTO(Long id, String titulo, LocalDate fecha, LocalTime hora, String ubicacion, String imagen, String nombreCategoria, String estado) {
        this.id = id;
        this.titulo = titulo;
        this.fecha = fecha;
        this.hora = hora;
        this.ubicacion = ubicacion;
        this.imagen = imagen;
        this.nombreCategoria = nombreCategoria;
        this.estado = estado;

    }



    // Getters
    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public LocalDate getFecha() { return fecha; }
    public LocalTime getHora() { return hora; }
    public String getUbicacion() { return ubicacion; }
    public String getImagen() { return imagen; }
    public String getNombreCategoria() { return nombreCategoria; }
    public String getEstado() { return estado; }



}