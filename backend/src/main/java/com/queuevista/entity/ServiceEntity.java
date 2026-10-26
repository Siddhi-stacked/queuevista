package com.queuevista.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * ServiceEntity maps to the 'services' table in PostgreSQL.
 * Viva Explanation:
 * Named ServiceEntity to prevent name collisions with Spring's @Service stereotype annotation.
 * Represents departments (e.g. General Consultation, Billing) and stores token_prefix (e.g. 'D')
 * used for generating tokens like D-108.
 */
@Entity
@Table(name = "services", uniqueConstraints = {
    @UniqueConstraint(name = "uq_service_org_name", columnNames = {"organization_id", "name"}),
    @UniqueConstraint(name = "uq_service_org_prefix", columnNames = {"organization_id", "token_prefix"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "token_prefix", nullable = false, length = 5)
    private String tokenPrefix; // e.g. 'D', 'B', 'V'

    @Column(name = "average_service_time_minutes", nullable = false)
    @Builder.Default
    private Integer averageServiceTimeMinutes = 15;

    @Column(name = "priority_enabled", nullable = false)
    @Builder.Default
    private Boolean priorityEnabled = true;

    @Column(name = "max_queue_size", nullable = false)
    @Builder.Default
    private Integer maxQueueSize = 50;

    @Column(name = "operating_hours", nullable = false, length = 100)
    private String operatingHours;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
