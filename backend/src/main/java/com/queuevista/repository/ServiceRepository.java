package com.queuevista.repository;

import com.queuevista.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ServiceRepository provides query methods for service departments.
 * Viva Explanation:
 * Allows looking up all services offered by an organization (e.g., General Consultation, Billing)
 * and verifying that token prefixes (such as 'D', 'B') are unique within each facility.
 */
@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {

    List<ServiceEntity> findByOrganizationId(Long organizationId);

    Optional<ServiceEntity> findByOrganizationIdAndTokenPrefix(Long organizationId, String tokenPrefix);
}
