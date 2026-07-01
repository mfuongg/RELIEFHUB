package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

public class DonationDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DonationResponse {
        private Long id;
        private Long userId;
        private String donorName;
        private Long campaignId;
        private String campaignTitle;
        private BigDecimal amount;
        private String message;
        private Boolean isAnonymous;
        private String status;
        private String donatedAt;
        private List<ItemDTO> items;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateDonationRequest {
        @NotNull
        private Long campaignId;

        @NotNull @Positive
        private BigDecimal amount;

        private String message;
        private Boolean isAnonymous;
        private List<ItemDTO> items;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ItemDTO {
        private String itemName;
        private Integer quantity;
        private String unit;
        private String note;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateDonationStatusRequest {
        @NotBlank
        private String status; // PENDING, CONFIRMED, REFUNDED, CANCELLED
    }
}
