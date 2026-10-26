package com.queuevista.entity;

/**
 * CounterStatus indicates the operational state of a physical counter desk.
 * Viva Explanation:
 * Tracks if a counter is actively serving (ACTIVE), open but waiting (IDLE), or shut down (CLOSED)
 * so tickets are only dispatched to available desks.
 */
public enum CounterStatus {
    ACTIVE,
    IDLE,
    CLOSED
}
