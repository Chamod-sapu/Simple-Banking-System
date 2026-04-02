package com.bank.notification.service;

import com.bank.notification.dto.NotificationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class NotificationService {

    /**
     * Process a notification request.
     * In a production system, this would send emails/SMS.
     * For this project, we log the notification details.
     */
    public String sendNotification(NotificationRequest request) {
        String notificationLog = String.format(
                "[NOTIFICATION | %s] To: %s | Subject: %s | Message: %s",
                LocalDateTime.now(),
                request.getRecipient(),
                request.getSubject(),
                request.getMessage()
        );

        log.info("📧 {}", notificationLog);

        // In production: EmailService.send(request.getRecipient(), request.getSubject(), request.getMessage());
        return "Notification sent successfully to: " + request.getRecipient();
    }
}
