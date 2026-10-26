package com.queuevista.entity;

/**
 * QueueStatus models the live lifecycle of a digital queue ticket.
 * Viva Explanation:
 * Enforces the progression from WAITING in line, to CALLED by staff, to SERVING at the counter,
 * ending in COMPLETED, SKIPPED (temporarily absent), CANCELLED by user, or NO_SHOW.
 */
public enum QueueStatus {
    WAITING,
    CALLED,
    SERVING,
    COMPLETED,
    SKIPPED,
    CANCELLED,
    NO_SHOW
}
