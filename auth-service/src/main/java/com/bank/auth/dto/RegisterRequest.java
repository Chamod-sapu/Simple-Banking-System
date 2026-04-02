package com.bank.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;

    private String role; // USER or ADMIN (defaults to USER if not provided)
}
