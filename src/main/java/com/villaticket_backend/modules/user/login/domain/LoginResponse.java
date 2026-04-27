package com.villaticket_backend.modules.user.login.domain;

public class LoginResponse {
    private String token;
    private String email;
    private String rol;

    public LoginResponse(String token, String email, String rol) {
        this.token = token;
        this.email = email;
        this.rol = rol;
    }

    // Getters
    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getRol() { return rol; }

    // Setters
    public void setToken(String token) { this.token = token; }
    public void setEmail(String email) { this.email = email; }
    public void setRol(String rol) { this.rol = rol; }
}