package com.villaticket_backend.modules.user.application.dtos;

public class PerfilDTO {
    private String nombre;
    private String email;
    private String rol;
    private String urlAvatar;
    private String iban;

    public PerfilDTO() {}

    public PerfilDTO(String nombre, String email, String rol, String urlAvatar, String iban) {
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.urlAvatar = urlAvatar;
        this.iban = iban;
    }


    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getUrlAvatar() { return urlAvatar; }
    public void setUrlAvatar(String urlAvatar) { this.urlAvatar = urlAvatar; }
    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }
}