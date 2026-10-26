package com.queuevista.entity;

/**
 * QueuePriority defines the serving priority tier for a ticket.
 * Viva Explanation:
 * Allows checked-in appointments or emergency cases to be tagged as HIGH priority
 * so they are served ahead of NORMAL walk-in tokens in the queue ordering logic.
 */
public enum QueuePriority {
    NORMAL,
    HIGH
}
