package com.bank.transaction.service;

import com.bank.transaction.client.AccountClient;
import com.bank.transaction.client.NotificationClient;
import com.bank.transaction.client.dto.AccountDto;
import com.bank.transaction.client.dto.NotificationRequest;
import com.bank.transaction.dto.DepositWithdrawRequest;
import com.bank.transaction.dto.TransactionResponse;
import com.bank.transaction.dto.TransferRequest;
import com.bank.transaction.entity.Transaction;
import com.bank.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountClient accountClient;
    private final NotificationClient notificationClient;

    /**
     * Transfer money from one account to another.
     */
    @Transactional
    public TransactionResponse transfer(TransferRequest request) {
        log.info("Starting transfer: Rs. {} from account {} to {}", request.getAmount(), request.getFromAccountId(), request.getToAccountId());

        // 0. Validation
        if (request.getFromAccountId().equals(request.getToAccountId())) {
            Transaction failed = saveTransaction(request.getFromAccountId(), request.getToAccountId(), Transaction.TransactionType.TRANSFER, 
                request.getAmount(), request.getDescription(), Transaction.TransactionStatus.FAILED, "Source and destination accounts are the same");
            return mapToResponse(failed);
        }

        try {
            // Fetch accounts to get usernames for notifications and verify existence
            AccountDto fromAccount = accountClient.getAccount(request.getFromAccountId());
            AccountDto toAccount = accountClient.getAccount(request.getToAccountId());

            // Perform atomic debit and credit
            accountClient.debit(fromAccount.getId(), Map.of("amount", request.getAmount()));
            accountClient.credit(toAccount.getId(), Map.of("amount", request.getAmount()));

            // Save success record
            Transaction transaction = saveTransaction(
                    request.getFromAccountId(), request.getToAccountId(),
                    Transaction.TransactionType.TRANSFER, request.getAmount(),
                    request.getDescription(), Transaction.TransactionStatus.SUCCESS, null
            );

            sendNotification(fromAccount.getUsername(), "Transfer Successful",
                    String.format("Rs. %.2f transferred to %s. New balance: Rs. %.2f",
                            request.getAmount(), toAccount.getAccountNumber(), fromAccount.getBalance().subtract(request.getAmount())));

            return mapToResponse(transaction);

        } catch (Exception e) {
            log.error("Transfer failed: {}", e.getMessage());
            Transaction failed = saveTransaction(request.getFromAccountId(), request.getToAccountId(), 
                Transaction.TransactionType.TRANSFER, request.getAmount(), request.getDescription(), 
                Transaction.TransactionStatus.FAILED, e.getMessage());
            return mapToResponse(failed);
        }
    }

    @Transactional
    public TransactionResponse deposit(DepositWithdrawRequest request) {
        log.info("Starting deposit: Rs. {} to account {}", request.getAmount(), request.getAccountId());
        try {
            AccountDto account = accountClient.credit(request.getAccountId(), Map.of("amount", request.getAmount()));

            Transaction transaction = saveTransaction(null, request.getAccountId(), Transaction.TransactionType.DEPOSIT,
                    request.getAmount(), request.getDescription() != null ? request.getDescription() : "Cash Deposit",
                    Transaction.TransactionStatus.SUCCESS, null);

            sendNotification(account.getUsername(), "Deposit Successful",
                    String.format("Rs. %.2f deposited. New balance: Rs. %.2f", request.getAmount(), account.getBalance()));

            return mapToResponse(transaction);
        } catch (Exception e) {
            Transaction failed = saveTransaction(null, request.getAccountId(), Transaction.TransactionType.DEPOSIT,
                    request.getAmount(), request.getDescription(), Transaction.TransactionStatus.FAILED, e.getMessage());
            return mapToResponse(failed);
        }
    }

    @Transactional
    public TransactionResponse withdraw(DepositWithdrawRequest request) {
        log.info("Starting withdrawal: Rs. {} from account {}", request.getAmount(), request.getAccountId());
        try {
            AccountDto account = accountClient.debit(request.getAccountId(), Map.of("amount", request.getAmount()));

            Transaction transaction = saveTransaction(request.getAccountId(), null, Transaction.TransactionType.WITHDRAW,
                    request.getAmount(), request.getDescription() != null ? request.getDescription() : "Cash Withdrawal",
                    Transaction.TransactionStatus.SUCCESS, null);

            sendNotification(account.getUsername(), "Withdrawal Successful",
                    String.format("Rs. %.2f withdrawn. New balance: Rs. %.2f", request.getAmount(), account.getBalance()));

            return mapToResponse(transaction);
        } catch (Exception e) {
            Transaction failed = saveTransaction(request.getAccountId(), null, Transaction.TransactionType.WITHDRAW,
                    request.getAmount(), request.getDescription(), Transaction.TransactionStatus.FAILED, e.getMessage());
            return mapToResponse(failed);
        }
    }

    /**
     * Get transaction history for an account.
     */
    public List<TransactionResponse> getHistory(Long accountId) {
        log.info("Fetching transaction history for account {}", accountId);
        return transactionRepository.findByAccountId(accountId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific transaction by ID.
     */
    public TransactionResponse getTransaction(Long id) {
        log.info("Fetching transaction details for id {}", id);
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        return mapToResponse(transaction);
    }

    private Transaction saveTransaction(Long fromId, Long toId, Transaction.TransactionType type,
                                        BigDecimal amount, String description,
                                        Transaction.TransactionStatus status, String failureReason) {
        Transaction transaction = Transaction.builder()
                .fromAccountId(fromId)
                .toAccountId(toId)
                .transactionType(type)
                .amount(amount)
                .description(description)
                .status(status)
                .failureReason(failureReason)
                .build();
        return transactionRepository.save(transaction);
    }

    private void sendNotification(String recipient, String subject, String message) {
        if (recipient == null) {
            log.warn("Cannot send notification: recipient username is null");
            return;
        }
        try {
            notificationClient.sendNotification(
                    new NotificationRequest(recipient, subject, message));
        } catch (Exception e) {
            // Non-critical: log and continue if notification fails
            log.warn("Failed to send notification to {}: {}", recipient, e.getMessage());
        }
    }

    private TransactionResponse mapToResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .fromAccountId(t.getFromAccountId())
                .toAccountId(t.getToAccountId())
                .transactionType(t.getTransactionType().name())
                .amount(t.getAmount())
                .description(t.getDescription())
                .status(t.getStatus().name())
                .failureReason(t.getFailureReason())
                .transactionDate(t.getTransactionDate())
                .build();
    }
}
