package com.queuevista.repository;

import com.queuevista.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository provides Spring Data JPA CRUD and query methods for User entities.
 * Viva Explanation:
 * Extends JpaRepository to inherit standard persistence methods, and declares derived query methods
 * like findByEmail and existsByEmail to support authentication and uniqueness validation.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
