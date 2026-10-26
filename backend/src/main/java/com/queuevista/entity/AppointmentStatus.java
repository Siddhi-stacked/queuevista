package com.queuevista.entity;

/**
 * AppointmentStatus models the lifecycle of a pre-booked time slot.
 * Viva Explanation:
 * Tracks whether a scheduled visit is confirmed, checked-in upon patient arrival,
 * completed at the counter, cancelled in advance, or flagged as a missed appointment (NO_SHOW).
 */
public enum AppointmentStatus {
    CONFIRMED,
    CHECKED_IN,
    COMPLETED,
    CANCELLED,
    NO_SHOW
}
