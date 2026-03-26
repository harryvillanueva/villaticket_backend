package com.villaticket_backend.modules.user.infrastructure.persistence;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nombre;

    private String iban;

    @Column(name = "url_avatar")
    private String urlAvatar;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    // --- CAMBIO AQUI: Relación con RolEntity ---
    @ManyToOne(fetch = FetchType.EAGER) // EAGER para que traiga el rol al buscar el usuario (útil para el Login)
    @JoinColumn(name = "rol_id", nullable = false)
    private RolEntity rol;

    public UsuarioEntity() {}

    // Getters y Setters...
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

    public RolEntity getRol() { return rol; }
    public void setRol(RolEntity rol) { this.rol = rol; }
}