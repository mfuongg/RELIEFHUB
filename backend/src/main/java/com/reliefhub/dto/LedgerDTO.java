package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

public class LedgerDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class LedgerResponse {
        private Long id;
        private Long campaignId;
        private String campaignTitle;
        private String type;
        private BigDecimal amount;
        private String description;
        private String referenceType;
        private Long referenceId;
        private String recordedAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateLedgerRequest {
        private Long campaignId;
        @NotBlank
        private String type; // INCOME, EXPENSE
        @NotNull @Positive
        private BigDecimal amount;
        private String description;
        private String referenceType;
        private Long referenceId;
    }
}
