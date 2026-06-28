package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "donation_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DonationItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donation_id", nullable = false)
    private Donation donation;

    @Column(name = "item_name", length = 255)
    private String itemName;

    private Integer quantity;

    @Column(length = 50)
    private String unit;

    @Column(columnDefinition = "TEXT")
    private String note;
}
