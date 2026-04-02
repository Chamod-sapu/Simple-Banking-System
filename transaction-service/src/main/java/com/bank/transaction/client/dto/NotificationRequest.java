package com.bank.transaction.client.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for sending notification requests to notification-service.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {
    private String recipient;
    private String subject;
    private String message;
}
