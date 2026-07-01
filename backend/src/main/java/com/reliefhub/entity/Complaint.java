package com.reliefhub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_code", unique = true, length = 20)
    private String complaintCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(name = "sender_name", length = 255)
    private String senderName;

    @Column(name = "sender_role", length = 50)
    private String senderRole;

    @Column(length = 100)
    private String type;

    @Column(length = 500)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "contact_info", length = 255)
    private String contactInfo;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('PENDING','IN_REVIEW','REPLIED','CLOSED') DEFAULT 'PENDING'")
    private ComplaintStatus status;

    @Column(name = "admin_reply", columnDefinition = "TEXT")
    private String adminReply;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    @Column
    private Integer progress;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    public enum ComplaintStatus { PENDING, IN_REVIEW, REPLIED, CLOSED }
}
