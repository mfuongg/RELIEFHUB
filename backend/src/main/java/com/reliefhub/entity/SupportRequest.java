package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SupportRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizen_id")
    private User citizen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @Column(name = "request_code", unique = true, length = 50)
    private String requestCode;

    @Column(name = "item_name", length = 255)
    private String itemName;

    private Integer quantity;

    @Column(length = 50)
    private String unit;

    @Column(length = 255)
    private String area;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM'")
    private Urgency urgency;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "household_count")
    private Integer householdCount;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PENDING','VERIFIED','APPROVED','WAREHOUSE_READY','IN_TRANSIT','DELIVERED','REJECTED') DEFAULT 'PENDING'")
    private RequestStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    public enum Urgency { LOW, MEDIUM, HIGH, CRITICAL }
    public enum RequestStatus {
        PENDING, VERIFIED, APPROVED, WAREHOUSE_READY, IN_TRANSIT, DELIVERED, REJECTED
    }
}
