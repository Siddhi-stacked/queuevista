package com.queuevista.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Counter represents a physical or logical service desk operated by staff.
 * Viva Explanation:
 * Manned by at most one staff user via a unique foreign key on staff_id.
 * Avoids circular foreign keys with User, and associates each desk with its designated service.
 */
@Entity
@Table(name = "counters", uniqueConstraints = {
    @UniqueConstraint(name = "uq_counter_org_number", columnNames = {"organization_id", "counter_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Counter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", unique = true)
    private User staff;

    @Column(name = "counter_number", nullable = false)
    private Integer counterNumber;

    @Column(nullable = false, length = 50)
    private String name; // e.g. "Counter 1", "Window A"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CounterStatus status = CounterStatus.IDLE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
