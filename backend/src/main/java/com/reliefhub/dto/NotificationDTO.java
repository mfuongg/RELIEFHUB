package com.reliefhub.dto;

import lombok.*;

public class NotificationDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class NotificationResponse {
        private Long id;
        private String title;
        private String body;
        private String type;
        private Boolean isRead;
        private String link;
        private String createdAt;
    }
}
