package com.queuevista.repository;

import com.queuevista.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * NotificationRepository fetches user alerts and calculates unread message counts.
 * Viva Explanation:
 * Provides countByUserIdAndIsReadFalse to quickly drive badge notification indicators
 * on the frontend top navigation bar.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndIsReadFalse(Long userId);
}
