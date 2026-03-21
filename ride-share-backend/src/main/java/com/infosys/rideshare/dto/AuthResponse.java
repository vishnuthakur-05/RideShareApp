package com.infosys.rideshare.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String message;
    private String role;
    private boolean isFirstLogin;

    public AuthResponse(String token, String message, String role, boolean isFirstLogin) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.isFirstLogin = isFirstLogin;
    }
}
