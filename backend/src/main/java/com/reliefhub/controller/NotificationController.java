package com.reliefhub.controller;

import com.reliefhub.common.ApiResponse;
import com.reliefhub.dto.NotificationDTO;
import com.reliefhub.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Thông báo")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping public ResponseEntity<ApiResponse<List<NotificationDTO.NotificationResponse>>> getMy() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getMyNotifications()));
    }
    @GetMapping("/unread-count") public ResponseEntity<ApiResponse<Integer>> unreadCount() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUnreadCount()));
    }
    @PatchMapping("/{id}/read") public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success("Đã đánh dấu đã đọc"));
    }
    @PatchMapping("/read-all") public ResponseEntity<ApiResponse<Void>> markAllRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.success("Đã đánh dấu tất cả đã đọc"));
    }
}
