package com.queuevista.repository;

import com.queuevista.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * OrganizationRepository provides CRUD access for facility/branch records.
 * Viva Explanation:
 * Allows querying organizations by primary key and checking facility names for uniqueness
 * when onboarding clinics or banks into QueueVista.
 */
@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    Optional<Organization> findByName(String name);
}
