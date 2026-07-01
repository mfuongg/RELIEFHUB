package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "campaign_categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CampaignCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
}
