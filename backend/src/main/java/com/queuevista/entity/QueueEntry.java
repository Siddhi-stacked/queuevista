package com.queuevista.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

/**
 * QueueEntry represents an individual ticket in the digital queue.
 * Viva Explanation:
 * The transactional core of QueueVista. Tracks token numbers (e.g. D-108), daily sequence,
 * entry date for daily resets, line priority, and exact timestamps across lifecycle states.
 */
@Entity
@Table(name = "queue_entries", uniqueConstraints = {
    @UniqueConstraint(name = "uq_queue_service_date_seq", columnNames = {"service_id", "entry_date", "daily_sequence"}),
    @UniqueConstraint(name = "uq_queue_service_date_token", columnNames = {"service_id", "entry_date", "token_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counter_id")
    private Counter counter;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", unique = true)
    private Appointment appointment;

    @Column(name = "token_number", nullable = false, length = 20)
    private String tokenNumber; // e.g. "D-108"

    @Column(name = "daily_sequence", nullable = false)
    private Integer dailySequence; // e.g. 108

    @Column(name = "entry_date", nullable = false)
    @Builder.Default
    private LocalDate entryDate = LocalDate.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private QueueType type = QueueType.WALK_IN;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private QueuePriority priority = QueuePriority.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private QueueStatus status = QueueStatus.WAITING;

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;

    @Column(name = "called_at")
    private Instant calledAt;

    @Column(name = "served_at")
    private Instant servedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
