package com.queuevista.entity;

/**
 * QueueType categorizes how the user entered the queue.
 * Viva Explanation:
 * Differentiates between walk-in visitors and patients arriving with pre-booked appointments,
 * aiding reporting and automated priority dispatch.
 */
public enum QueueType {
    WALK_IN,
    APPOINTMENT
}
