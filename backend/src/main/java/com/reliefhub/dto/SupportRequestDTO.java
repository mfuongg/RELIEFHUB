package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class SupportRequestDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SupportRequestResponse {
        private Long id;
        private String requestCode;
        private Long citizenId;
        private String citizenName;
        private Long campaignId;
        private String itemName;
        private Integer quantity;
        private String unit;
        private String area;
        private String urgency;
        private String reason;
        private Integer householdCount;
        private String status;
        private String notes;
        private String createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateSupportRequestRequest {
        private Long campaignId;

        @NotBlank
        private String itemName;

        private Integer quantity;
        private String unit;

        @NotBlank
        private String area;

        private String urgency; // LOW, MEDIUM, HIGH, CRITICAL
        private String reason;
        private Integer householdCount;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AdvanceStatusRequest {
        @NotBlank
        private String newStatus; // VERIFIED, APPROVED, WAREHOUSE_READY, IN_TRANSIT, DELIVERED, REJECTED
        private String note;
    }
}
