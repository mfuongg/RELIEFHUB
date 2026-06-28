package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "donations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @Column(precision = 18, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_anonymous")
    private Boolean isAnonymous;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PENDING','CONFIRMED','REFUNDED','CANCELLED') DEFAULT 'PENDING'")
    private DonationStatus status;

    @Column(name = "donated_at", updatable = false, insertable = false)
    private LocalDateTime donatedAt;

    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DonationItem> items;

    public enum DonationStatus {
        PENDING, CONFIRMED, REFUNDED, CANCELLED
    }
}
