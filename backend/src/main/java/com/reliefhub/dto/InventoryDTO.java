package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class InventoryDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class InventoryResponse {
        private Long id;
        private String itemName;
        private String category;
        private Integer quantity;
        private String unit;
        private Integer minStock;
        private Integer warehouseId;
        private String warehouseName;
        private String description;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateInventoryRequest {
        @NotBlank
        private String itemName;
        private String category;
        @NotNull
        private Integer quantity;
        private String unit;
        private Integer minStock;
        private Integer warehouseId;
        private String description;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateInventoryRequest {
        private String itemName;
        private String category;
        private Integer quantity;
        private String unit;
        private Integer minStock;
        private Integer warehouseId;
        private String description;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class RestockRequest {
        @NotNull @Positive
        private Integer quantity;
        private String note;
    }
}
