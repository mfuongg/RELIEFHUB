package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

public class CampaignDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CampaignResponse {
        private Long id;
        private String title;
        private String description;
        private String category;
        private BigDecimal targetAmount;
        private BigDecimal currentAmount;
        private Double progressPct;
        private String status;
        private String area;
        private String startDate;
        private String endDate;
        private String thumbnailUrl;
        private String createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateCampaignRequest {
        @NotBlank(message = "Tên chiến dịch không được để trống")
        private String title;

        private String description;
        private Long categoryId;

        @NotNull(message = "Mục tiêu đóng góp không được để trống")
        private BigDecimal targetAmount;

        private String startDate;
        private String endDate;
        private String status;
        private String area;
        private String thumbnailUrl;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateCampaignRequest {
        private String title;
        private String description;
        private BigDecimal targetAmount;
        private String startDate;
        private String endDate;
        private String status;
        private String area;
        private String thumbnailUrl;
    }
}
