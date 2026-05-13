package com.villaticket_backend.modules.user.application.dtos;

public class CambiarPasswordRequest {
    private String passwordActual;
    private String passwordNueva;

    public CambiarPasswordRequest() {}

    public CambiarPasswordRequest(String passwordActual, String passwordNueva) {
        this.passwordActual = passwordActual;
        this.passwordNueva = passwordNueva;
    }

    // Getters y Setters
    public String getPasswordActual() { return passwordActual; }
    public void setPasswordActual(String passwordActual) { this.passwordActual = passwordActual; }

    public String getPasswordNueva() { return passwordNueva; }
    public void setPasswordNueva(String passwordNueva) { this.passwordNueva = passwordNueva; }
}