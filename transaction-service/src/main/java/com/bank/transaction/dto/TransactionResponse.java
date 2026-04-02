package com.bank.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Long id;
    private Long fromAccountId;
    private Long toAccountId;
    private String transactionType;
    private BigDecimal amount;
    private String description;
    private String status;
    private String failureReason;
    private LocalDateTime transactionDate;
}
