package com.villaticket_backend.modules.user.domain.model;

import java.time.LocalDateTime;

public class Usuario {
    private Long id;
    private String email;
    private String password;
    private String nombre;
    private String rol;
    private String iban;
    private String urlAvatar;
    private LocalDateTime fechaRegistro;


    public Usuario() {
    }


    public Usuario(Long id, String email, String password, String nombre, String rol, String iban, String urlAvatar, LocalDateTime fechaRegistro) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nombre = nombre;
        this.rol = rol;
        this.iban = iban;
        this.urlAvatar = urlAvatar;
        this.fechaRegistro = fechaRegistro;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }

    public String getUrlAvatar() { return urlAvatar; }
    public void setUrlAvatar(String urlAvatar) { this.urlAvatar = urlAvatar; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}