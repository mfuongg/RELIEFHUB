package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "delivery_code", unique = true, length = 50)
    private String deliveryCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id")
    private SupportRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private User driver;

    @Column(name = "vehicle_type", length = 100)
    private String vehicleType;

    @Column(name = "license_plate", length = 20)
    private String licensePlate;

    @Column(length = 255)
    private String origin;

    @Column(length = 255)
    private String destination;

    @Column(name = "depart_at")
    private LocalDateTime departAt;

    @Column(name = "arrive_at")
    private LocalDateTime arriveAt;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('SCHEDULED','IN_TRANSIT','DELIVERED','FAILED') DEFAULT 'SCHEDULED'")
    private DeliveryStatus status;

    @Column(columnDefinition = "TEXT")
    private String note;

    public enum DeliveryStatus { SCHEDULED, IN_TRANSIT, DELIVERED, FAILED }
}
