package com.queuevista.repository;

import com.queuevista.entity.QueueEntry;
import com.queuevista.entity.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * QueueEntryRepository executes persistence and queue progression queries for live tokens.
 * Viva Explanation:
 * Features findMaxDailySequence to atomically determine the next sequential token number (e.g. 108)
 * for a service on the current day, guaranteeing natural daily ticket resets.
 */
@Repository
public interface QueueEntryRepository extends JpaRepository<QueueEntry, Long> {

    Optional<QueueEntry> findByTokenNumber(String tokenNumber);

    List<QueueEntry> findByUserIdOrderByJoinedAtDesc(Long userId);

    List<QueueEntry> findByServiceIdAndEntryDateAndStatus(Long serviceId, LocalDate entryDate, QueueStatus status);

    @Query("SELECT COALESCE(MAX(q.dailySequence), 100) FROM QueueEntry q WHERE q.service.id = :serviceId AND q.entryDate = :entryDate")
    Integer findMaxDailySequence(@Param("serviceId") Long serviceId, @Param("entryDate") LocalDate entryDate);
}
