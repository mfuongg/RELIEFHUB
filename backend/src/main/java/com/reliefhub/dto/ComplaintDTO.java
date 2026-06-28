package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class ComplaintDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ComplaintResponse {
        private Long id;
        private String complaintCode;
        private String senderName;
        private String senderRole;
        private String type;
        private String subject;
        private String content;
        private String contactInfo;
        private String status;
        private String adminReply;
        private Integer progress;
        private String createdAt;
        private String repliedAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateComplaintRequest {
        private String type;

        @NotBlank
        private String subject;

        @NotBlank
        private String content;

        private String contactInfo;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ReplyComplaintRequest {
        @NotBlank
        private String adminReply;
    }
}
