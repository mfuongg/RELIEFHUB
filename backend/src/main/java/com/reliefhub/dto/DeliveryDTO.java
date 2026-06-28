package com.reliefhub.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class DeliveryDTO {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DeliveryResponse {
        private Long id;
        private String deliveryCode;
        private Long requestId;
        private Long campaignId;
        private String campaignTitle;
        private Long driverId;
        private String driverName;
        private String vehicleType;
        private String licensePlate;
        private String origin;
        private String destination;
        private String departAt;
        private String arriveAt;
        private String status;
        private String note;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CreateDeliveryRequest {
        private Long requestId;
        private Long campaignId;
        private Long driverId;
        private String vehicleType;
        private String licensePlate;
        private String origin;
        private String destination;
        private String departAt;
        private String status;
        private String note;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class UpdateDeliveryStatusRequest {
        @NotBlank
        private String status; // SCHEDULED, IN_TRANSIT, DELIVERED, FAILED
        private String note;
    }
}
