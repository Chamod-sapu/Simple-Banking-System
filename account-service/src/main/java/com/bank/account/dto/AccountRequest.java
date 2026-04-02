package com.bank.account.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Account type is required (SAVINGS, CURRENT, FIXED_DEPOSIT)")
    private String accountType;
}
