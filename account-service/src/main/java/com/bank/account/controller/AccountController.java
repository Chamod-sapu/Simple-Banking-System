package com.bank.account.controller;

import com.bank.account.dto.AccountRequest;
import com.bank.account.dto.AccountResponse;
import com.bank.account.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@Slf4j
public class AccountController {

    private final AccountService accountService;

    /**
     * POST /accounts
     * Create a new bank account.
     */
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@Valid @RequestBody AccountRequest request) {
        log.info("Create account request for user: {}", request.getUsername());
        AccountResponse response = accountService.createAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /accounts/user/{userId}
     * Get all accounts for a user (by userId).
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountResponse>> getAccountsByUserId(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(accountService.getAccountsByUserId(userId));
    }

    /**
     * GET /accounts/{id}
     * Get a specific account by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    /**
     * GET /accounts/{id}/balance
     * Get the balance of a specific account.
     */
    @GetMapping("/{id}/balance")
    public ResponseEntity<Map<String, Object>> getBalance(@PathVariable("id") Long id) {
        BigDecimal balance = accountService.getBalance(id);
        return ResponseEntity.ok(Map.of("accountId", id, "balance", balance));
    }

    /**
     * GET /accounts/number/{accountNumber}
     * Get account by account number.
     */
    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<AccountResponse> getByAccountNumber(@PathVariable("accountNumber") String accountNumber) {
        return ResponseEntity.ok(accountService.getAccountByNumber(accountNumber));
    }

    // ===== INTERNAL ENDPOINTS (called by Transaction Service via Feign, no JWT)
    // =====

    /**
     * GET /accounts/internal/{id}
     * Internal: Get account details (called by transaction-service).
     */
    @GetMapping("/internal/{id}")
    public ResponseEntity<AccountResponse> getAccountInternal(@PathVariable("id") Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    /**
     * PUT /accounts/internal/{id}/balance
     * Internal: Update balance (called by transaction-service).
     */
    @PutMapping("/internal/{id}/balance")
    public ResponseEntity<AccountResponse> updateBalance(
            @PathVariable("id") Long id,
            @RequestBody Map<String, BigDecimal> request) {
        BigDecimal newBalance = request.get("balance");
        return ResponseEntity.ok(accountService.updateBalance(id, newBalance));
    }

    @PostMapping("/internal/{id}/debit")
    public ResponseEntity<AccountResponse> debit(
            @PathVariable("id") Long id,
            @RequestBody Map<String, BigDecimal> request) {
        BigDecimal amount = request.get("amount");
        return ResponseEntity.ok(accountService.debit(id, amount));
    }

    @PostMapping("/internal/{id}/credit")
    public ResponseEntity<AccountResponse> credit(
            @PathVariable("id") Long id,
            @RequestBody Map<String, BigDecimal> request) {
        BigDecimal amount = request.get("amount");
        return ResponseEntity.ok(accountService.credit(id, amount));
    }

    /**
     * GET /accounts/health
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Account Service is UP");
    }
}
