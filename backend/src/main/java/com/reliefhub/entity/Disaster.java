package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "disasters")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Disaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 100)
    private String type;

    @Column(length = 255)
    private String area;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM'")
    private Severity severity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "occurred_at")
    private LocalDate occurredAt;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ACTIVE','RESOLVED','MONITORING') DEFAULT 'ACTIVE'")
    private DisasterStatus status;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    public enum Severity { LOW, MEDIUM, HIGH, CRITICAL }
    public enum DisasterStatus { ACTIVE, RESOLVED, MONITORING }
}
