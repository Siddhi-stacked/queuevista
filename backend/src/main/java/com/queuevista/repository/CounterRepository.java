package com.queuevista.repository;

import com.queuevista.entity.Counter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * CounterRepository handles database access for service desks and staff desk assignments.
 * Viva Explanation:
 * Includes findByStaffId to dynamically determine which counter an authenticated staff member
 * is assigned to upon login without needing circular entity references.
 */
@Repository
public interface CounterRepository extends JpaRepository<Counter, Long> {

    List<Counter> findByOrganizationId(Long organizationId);

    Optional<Counter> findByStaffId(Long staffId);

    List<Counter> findByServiceId(Long serviceId);
}
