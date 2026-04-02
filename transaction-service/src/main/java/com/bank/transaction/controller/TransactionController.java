package com.bank.transaction.controller;

import com.bank.transaction.dto.DepositWithdrawRequest;
import com.bank.transaction.dto.TransactionResponse;
import com.bank.transaction.dto.TransferRequest;
import com.bank.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * POST /transactions/transfer
     * Transfer money from one account to another.
     */
    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@Valid @RequestBody TransferRequest request) {
        log.info("Transfer request: {} -> {}, amount: {}",
                request.getFromAccountId(), request.getToAccountId(), request.getAmount());
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.transfer(request));
    }

    /**
     * POST /transactions/deposit
     * Deposit money into an account.
     */
    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(@Valid @RequestBody DepositWithdrawRequest request) {
        log.info("Deposit request: accountId={}, amount={}", request.getAccountId(), request.getAmount());
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.deposit(request));
    }

    /**
     * POST /transactions/withdraw
     * Withdraw money from an account.
     */
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(@Valid @RequestBody DepositWithdrawRequest request) {
        log.info("Withdraw request: accountId={}, amount={}", request.getAccountId(), request.getAmount());
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.withdraw(request));
    }

    /**
     * GET /transactions/history/{accountId}
     * Get transaction history for an account.
     */
    @GetMapping("/history/{accountId}")
    public ResponseEntity<List<TransactionResponse>> getHistory(@PathVariable("accountId") Long accountId) {
        return ResponseEntity.ok(transactionService.getHistory(accountId));
    }

    /**
     * GET /transactions/{id}
     * Get a specific transaction by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable("id") Long id) {
        return ResponseEntity.ok(transactionService.getTransaction(id));
    }

    /**
     * GET /transactions/health
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Transaction Service is UP");
    }
}
