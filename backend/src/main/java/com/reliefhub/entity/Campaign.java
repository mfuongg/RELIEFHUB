package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaigns")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_id")
    private Integer categoryId;

    @Column(name = "target_amount", precision = 18, scale = 2)
    private BigDecimal targetAmount;

    @Column(name = "current_amount", precision = 18, scale = 2)
    private BigDecimal currentAmount;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('DRAFT','ACTIVE','PAUSED','COMPLETED','CANCELLED') DEFAULT 'DRAFT'")
    private CampaignStatus status;

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(length = 255)
    private String area;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    public enum CampaignStatus {
        DRAFT, ACTIVE, PAUSED, COMPLETED, CANCELLED
    }
}
