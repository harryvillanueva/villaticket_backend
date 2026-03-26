package com.villaticket_backend.modules.user.domain.model;

import java.time.LocalDateTime;

public class Usuario {
    private Long id;
    private String email;
    private String password;
    private String nombre;
    private String rolNombre; // <-- Guardaremos solo el nombre del rol en el dominio ('CLIENTE', 'VENDEDOR')
    private String iban;
    private String urlAvatar;
    private LocalDateTime fechaRegistro;

    public Usuario() {}

    // Actualiza el constructor y los getters/setters para usar 'rolNombre' en lugar de 'rol'
    public String getRolNombre() { return rolNombre; }
    public void setRolNombre(String rolNombre) { this.rolNombre = rolNombre; }

    // ... mantén los demás getters y setters iguales ...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }
    public String getUrlAvatar() { return urlAvatar; }
    public void setUrlAvatar(String urlAvatar) { this.urlAvatar = urlAvatar; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}