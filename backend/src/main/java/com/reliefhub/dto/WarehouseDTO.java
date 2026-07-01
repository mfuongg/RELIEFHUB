package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class WarehouseDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class WarehouseResponse {
        private Long id;
        private String name;
        private String address;
        private String province;
        private String status;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateWarehouseRequest {
        @NotBlank
        private String name;
        private String address;
        private String province;
        private String status;
    }
}
