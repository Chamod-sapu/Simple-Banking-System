package com.bank.transaction.client;

import com.bank.transaction.client.dto.AccountDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Feign client to communicate with account-service.
 * Uses the service name registered in Eureka for load-balanced calls.
 * Calls the /internal/** endpoints which don't require JWT.
 */
@FeignClient(name = "account-service")
public interface AccountClient {

    @GetMapping("/accounts/internal/{id}")
    AccountDto getAccount(@PathVariable("id") Long accountId);

    @PutMapping("/accounts/internal/{id}/balance")
    AccountDto updateBalance(@PathVariable("id") Long accountId, @RequestBody Map<String, BigDecimal> request);

    @PostMapping("/accounts/internal/{id}/debit")
    AccountDto debit(@PathVariable("id") Long accountId, @RequestBody Map<String, BigDecimal> request);

    @PostMapping("/accounts/internal/{id}/credit")
    AccountDto credit(@PathVariable("id") Long accountId, @RequestBody Map<String, BigDecimal> request);
}
