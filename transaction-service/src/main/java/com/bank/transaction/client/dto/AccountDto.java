package com.bank.transaction.client.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO representing an Account response from account-service.
 */
@Data
public class AccountDto {
    private Long id;
    private String accountNumber;
    private Long userId;
    private String username;
    private String accountType;
    private BigDecimal balance;
    private String status;
    private LocalDateTime createdAt;
}
