package com.bank.notification.controller;

import com.bank.notification.dto.NotificationRequest;
import com.bank.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * POST /notifications/send
     * Called by transaction-service after every transaction.
     * Logs the notification (simulates email/SMS in production).
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationRequest request) {
        String result = notificationService.sendNotification(request);
        return ResponseEntity.ok(result);
    }

    /**
     * GET /notifications/health
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Notification Service is UP");
    }
}
