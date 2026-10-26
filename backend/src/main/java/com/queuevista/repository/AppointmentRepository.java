package com.queuevista.repository;

import com.queuevista.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * AppointmentRepository manages booking persistence and slot availability queries.
 * Viva Explanation:
 * Provides existsByServiceIdAndAppointmentDateAndTimeSlot to prevent double-booking slot collisions
 * before an appointment record is committed.
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserId(Long userId);

    Optional<Appointment> findByAppointmentCode(String appointmentCode);

    boolean existsByServiceIdAndAppointmentDateAndTimeSlot(Long serviceId, LocalDate date, String timeSlot);
}
