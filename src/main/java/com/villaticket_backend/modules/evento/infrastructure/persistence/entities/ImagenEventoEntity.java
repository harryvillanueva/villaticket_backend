package com.villaticket_backend.modules.evento.infrastructure.persistence.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "imagenes_evento")
public class ImagenEventoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "url_imagen", nullable = false, length = 500)
    private String urlImagen;

    @Column(nullable = false)
    private Integer orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private EventoEntity evento;



    public ImagenEventoEntity() {
    }

    public ImagenEventoEntity(Long id, String urlImagen, Integer orden, EventoEntity evento) {
        this.id = id;
        this.urlImagen = urlImagen;
        this.orden = orden;
        this.evento = evento;
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrlImagen() {
        return urlImagen;
    }


    public void setUrlImagen(String urlImagen) {
        this.urlImagen = urlImagen;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    public EventoEntity getEvento() {
        return evento;
    }

    public void setEvento(EventoEntity evento) {
        this.evento = evento;
    }
}