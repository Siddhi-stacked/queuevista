package com.queuevista.repository;

import com.queuevista.entity.QueueEntry;
import com.queuevista.entity.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface QueueQueryRepository extends JpaRepository<QueueEntry, Long> {

    @Query("select coalesce(max(q.dailySequence), 100) from QueueEntry q where q.service.id = :sid and q.entryDate = :d")
    int maxSequence(@Param("sid") Long sid, @Param("d") LocalDate d);

    long countByService_IdAndEntryDateAndStatus(Long sid, LocalDate d, QueueStatus s);

    List<QueueEntry> findByService_IdAndEntryDateAndStatusOrderByDailySequenceAsc(Long sid, LocalDate d, QueueStatus s);

    Optional<QueueEntry> findFirstByService_IdAndEntryDateAndStatus(Long sid, LocalDate d, QueueStatus s);

    Optional<QueueEntry> findFirstByUser_IdAndEntryDateAndStatusIn(Long uid, LocalDate d, Collection<QueueStatus> s);
}