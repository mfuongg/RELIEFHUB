package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "volunteers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Volunteer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(length = 100)
    private String availability;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ACTIVE','INACTIVE','SUSPENDED') DEFAULT 'ACTIVE'")
    private VolunteerStatus status;

    @Column(name = "joined_at", updatable = false, insertable = false)
    private LocalDateTime joinedAt;

    public enum VolunteerStatus { ACTIVE, INACTIVE, SUSPENDED }
}
