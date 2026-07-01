package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class DisasterDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DisasterResponse {
        private Long id;
        private String name;
        private String type;
        private String area;
        private String severity;
        private String description;
        private String occurredAt;
        private String status;
        private String createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateDisasterRequest {
        @NotBlank(message = "Tên thiên tai không được để trống")
        private String name;

        private String type;
        private String area;
        private String severity;  // LOW, MEDIUM, HIGH, CRITICAL
        private String description;
        private String occurredAt;
        private String status;    // ACTIVE, RESOLVED, MONITORING
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateDisasterRequest {
        private String name;
        private String type;
        private String area;
        private String severity;
        private String description;
        private String occurredAt;
        private String status;
    }
}
