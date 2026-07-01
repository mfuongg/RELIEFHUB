package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(length = 50)
    private String type;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(length = 500)
    private String link;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;
}
