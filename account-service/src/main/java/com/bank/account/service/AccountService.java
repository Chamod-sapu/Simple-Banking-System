package com.bank.account.service;

import com.bank.account.dto.AccountRequest;
import com.bank.account.dto.AccountResponse;
import com.bank.account.entity.Account;
import com.bank.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final AccountRepository accountRepository;

    @Transactional
    public AccountResponse createAccount(AccountRequest request) {
        Account.AccountType type;
        try {
            type = Account.AccountType.valueOf(request.getAccountType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid account type. Must be SAVINGS, CURRENT, or FIXED_DEPOSIT");
        }

        String accountNumber = generateUniqueAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .userId(request.getUserId())
                .username(request.getUsername())
                .accountType(type)
                .balance(BigDecimal.ZERO)
                .status(Account.AccountStatus.ACTIVE)
                .build();

        Account saved = accountRepository.save(account);
        log.info("Created account {} for user {}", accountNumber, request.getUsername());
        return mapToResponse(saved);
    }

    public List<AccountResponse> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AccountResponse getAccountById(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
        return mapToResponse(account);
    }

    public AccountResponse getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found with number: " + accountNumber));
        return mapToResponse(account);
    }

    public BigDecimal getBalance(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));
        return account.getBalance();
    }

    // Internal method called by Transaction Service
    @Transactional
    public AccountResponse updateBalance(Long accountId, BigDecimal newBalance) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));
        account.setBalance(newBalance);
        Account updated = accountRepository.save(account);
        log.info("Balance updated for account {}: {}", accountId, newBalance);
        return mapToResponse(updated);
    }

    @Transactional
    public AccountResponse debit(Long accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));
        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance in account: " + accountId);
        }
        account.setBalance(account.getBalance().subtract(amount));
        return mapToResponse(accountRepository.save(account));
    }

    @Transactional
    public AccountResponse credit(Long accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));
        account.setBalance(account.getBalance().add(amount));
        return mapToResponse(accountRepository.save(account));
    }

    private String generateUniqueAccountNumber() {
        Random random = new Random();
        String number;
        do {
            number = String.format("%010d", (long) (random.nextDouble() * 9_000_000_000L) + 1_000_000_000L);
        } while (accountRepository.existsByAccountNumber(number));
        return number;
    }

    private AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .userId(account.getUserId())
                .username(account.getUsername())
                .accountType(account.getAccountType().name())
                .balance(account.getBalance())
                .status(account.getStatus().name())
                .createdAt(account.getCreatedAt())
                .build();
    }
}
