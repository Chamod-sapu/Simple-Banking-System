package com.bank.transaction.client;

import com.bank.transaction.client.dto.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Feign client to send notifications to notification-service.
 */
@FeignClient(name = "notification-service")
public interface NotificationClient {

    @PostMapping("/notifications/send")
    String sendNotification(@RequestBody NotificationRequest request);
}
