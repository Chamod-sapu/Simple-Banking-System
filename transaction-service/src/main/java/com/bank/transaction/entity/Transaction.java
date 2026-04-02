package com.bank.transaction.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long fromAccountId;     // null for DEPOSIT

    private Long toAccountId;       // null for WITHDRAW

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType; // TRANSFER, DEPOSIT, WITHDRAW

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status; // SUCCESS, FAILED

    private String failureReason;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @PrePersist
    protected void onCreate() {
        this.transactionDate = LocalDateTime.now();
        if (this.status == null) this.status = TransactionStatus.SUCCESS;
    }

    public enum TransactionType {
        TRANSFER, DEPOSIT, WITHDRAW
    }

    public enum TransactionStatus {
        SUCCESS, FAILED
    }
}
