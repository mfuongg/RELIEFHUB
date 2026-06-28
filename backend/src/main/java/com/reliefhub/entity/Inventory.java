package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(length = 100)
    private String category;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 50)
    private String unit;

    @Column(name = "min_stock")
    private Integer minStock;

    @Column(name = "warehouse_id")
    private Integer warehouseId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}
