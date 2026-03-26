package com.villaticket_backend.modules.user.register_user.domain;

public class RegisterUserRequest {
    private String email;
    private String password;
    private String nombre;
    private String rol;

    public RegisterUserRequest() {
    }


    public String getEmail() { return email; }


    public String getPassword() { return password; }


    public String getNombre() { return nombre; }


    public String getRol() { return rol; }

}