package com.reliefhub.service;

import com.reliefhub.dto.NotificationDTO;
import com.reliefhub.entity.Notification;
import com.reliefhub.entity.User;
import com.reliefhub.exception.ResourceNotFoundException;
import com.reliefhub.repository.NotificationRepository;
import com.reliefhub.repository.UserRepository;
import com.reliefhub.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationDTO.NotificationResponse> getMyNotifications() {
        CustomUserDetails userDetails = getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userDetails.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Integer getUnreadCount() {
        CustomUserDetails userDetails = getCurrentUser();
        return notificationRepository.findByUserIdAndIsReadFalse(userDetails.getId()).size();
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead() {
        CustomUserDetails userDetails = getCurrentUser();
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalse(userDetails.getId());
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    private CustomUserDetails getCurrentUser() {
        return (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private NotificationDTO.NotificationResponse toResponse(Notification n) {
        return NotificationDTO.NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .body(n.getBody())
                .type(n.getType())
                .isRead(n.getIsRead())
                .link(n.getLink())
                .createdAt(n.getCreatedAt() != null ? n.getCreatedAt().toString() : null)
                .build();
    }
}
